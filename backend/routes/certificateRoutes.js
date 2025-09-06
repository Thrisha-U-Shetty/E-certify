const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const QRCode = require("qrcode");
const axios = require("axios"); // since you're using it in /all
const FormData = require("form-data");

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

    // Return plain URL
    res.json({ success: true, certId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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

    res.json({ success: true, message: "No duplicate found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


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

    // Update DB using numeric certId
    await Certificate.findOneAndUpdate({ certId: certificateId }, { ipfsHash });

    res.json({ success: true, ipfsHash, ipfsUrl });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Pinata upload failed" });
  }
});

// GET /api/certificates/all
router.get("/all", async (req, res) => {
  try {
    const certificates = await Certificate.find({
      ipfsHash: { $exists: true, $nin: [null, ""] }, // non-empty strings only
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
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`, // public gateway
    }));

    res.json({ success: true, certificates: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Verify certificate by certId
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

// routes/certificateRoutes.js
router.get("/:certId", async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.certId });
    if (!cert)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
