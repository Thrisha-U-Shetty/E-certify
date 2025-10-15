import express from "express";
import Certificate from "../models/Certificate.js";
import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { sendCertificateEmail } from "../mailer/emails.js";
import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";

const router = express.Router();

// Create certificate and return QR code
router.post("/create", async (req, res) => {
  try {
    const { name, usn, courseTitle, type, start, end, issuedDate, signatory } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !usn ||
      !courseTitle ||
      !type ||
      !start ||
      !end ||
      !issuedDate ||
      !signatory
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const issueDate = new Date(issuedDate);

    if (issueDate < startDate || issueDate < endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Issued date must be on or after the end date and not before the start date",
      });
    }

    // Generate random 6-digit certId
    const certId = Math.floor(100000 + Math.random() * 900000).toString();

    // Save certificate metadata in DB
    const certificate = new Certificate({
      certId,
      name,
      usn,
      courseTitle,
      type,
      start,
      end,
      issuedDate,
      signatory,
      ipfsHash: "",
    });
    await certificate.save();

    res.json({ success: true, certId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Check for duplicates
router.post("/check-duplicate", async (req, res) => {
  try {
    const { name, courseTitle, type, start, end } = req.body;

    const duplicate = await Certificate.findOne({
      name,
      courseTitle,
      type,
      start,
      end,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Certificate already exists with the same details",
      });
    }

    const existingSameCourseType = await Certificate.findOne({
      name,
      courseTitle,
      type,
    });

    if (existingSameCourseType) {
      return res.status(400).json({
        success: false,
        message:
          "This person already has a certificate for the same course and type",
      });
    }

    res.json({ success: true, message: "No duplicate found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload certificate to IPFS
router.post("/upload", async (req, res) => {
  try {
    const { certificateId, pdfBase64 } = req.body;

    if (!certificateId)
      return res
        .status(400)
        .json({ success: false, message: "Certificate ID is required" });
    if (!pdfBase64)
      return res
        .status(400)
        .json({ success: false, message: "PDF Base64 is required" });

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const form = new FormData();
    form.append("file", pdfBuffer, "certificate.pdf");

    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      form,
      {
        maxBodyLength: "Infinity",
        headers: {
          ...form.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_API_SECRET,
        },
      }
    );

    const ipfsHash = pinataResponse.data.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    await Certificate.findOneAndUpdate({ certId: certificateId }, { ipfsHash });

    res.json({ success: true, ipfsHash, ipfsUrl });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Pinata upload failed" });
  }
});

// Get all certificates
router.get("/all", async (req, res) => {
  try {
    const certificates = await Certificate.find({
      ipfsHash: { $exists: true, $nin: [null, ""] },
    });

    if (!certificates.length)
      return res
        .status(404)
        .json({ success: false, message: "No certificates found" });

    const result = certificates.map((cert) => ({
      id: cert._id,
      certId: cert.certId,
      name: cert.name,
      courseTitle: cert.courseTitle,
      type: cert.type,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`,
    }));

    res.json({ success: true, certificates: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify certificate
router.get("/verify/:certId", async (req, res) => {
  try {
    const { certId } = req.params;
    const certificate = await Certificate.findOne({ certId });

    if (!certificate) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    res.json({ success: true, certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get certificate by ID
router.get("/:certId", async (req, res) => {
  try {
    const { certId } = req.params;
    const cert = await Certificate.findOne({ certId });
    if (!cert)
      return res.status(404).json({ success: false, message: "Not found" });

    const user = await User.findOne({ name: cert.name });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.encryptedPdfPassword) {
      const [ivHex, cipherHex] = user.encryptedPdfPassword.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const key = Buffer.from(process.env.PDF_MASTER_KEY_HEX, "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decryptedPassword = decipher.update(cipherHex, "hex", "utf8");
      decryptedPassword += decipher.final("utf8");

      // Fetch PDF from IPFS
      const ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
      const ipfsUrl = `${ipfsGateway}${cert.ipfsHash}`;
      const response = await fetch(ipfsUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF from IPFS");
      const buffer = Buffer.from(await response.arrayBuffer());

      const tempInput = path.join(os.tmpdir(), `${certId}_plain.pdf`);
      const tempOutput = path.join(os.tmpdir(), `${certId}_encrypted.pdf`);
      fs.writeFileSync(tempInput, buffer);

      // Encrypt PDF using pdftk CLI (user password only)
      await new Promise((resolve, reject) => {
        exec(
          `pdftk "${tempInput}" output "${tempOutput}" user_pw "${decryptedPassword}" allow Printing`,
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });

      const encryptedPdf = fs.readFileSync(tempOutput);

      // Combine course title + type + certificate number
      const certificateTitle = `${cert.courseTitle} ${cert.type} Certificate #${cert.certId}`;

      // Prepare email details
      const emailDetails = {
        certificateTitle, // course + type + number
        certificateNumber: cert.certId,
      };

      // Send certificate email
      await sendCertificateEmail(
        user.email,
        user.name,
        encryptedPdf,
        emailDetails
      );

      // Optional: clean up temp files
      fs.unlinkSync(tempInput);
      fs.unlinkSync(tempOutput);
    }

    // Return certificate metadata
    res.json({ success: true, cert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
