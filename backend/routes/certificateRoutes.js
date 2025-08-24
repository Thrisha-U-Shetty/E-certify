const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const QRCode = require("qrcode");
const axios = require("axios"); // since you're using it in /all

// Create certificate and return QR code
router.post("/create", async (req, res) => {
  try {
    const { name, usn, courseTitle, type, start, end, issuedDate, signatory } = req.body;

    // Validate required fields
    if (!name || !usn || !courseTitle || !type || !start || !end || !issuedDate || !signatory) {
      return res.status(400).json({ success: false, message: "All fields are required" });
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
      ipfsHash:""
    });
    await certificate.save();

    // Return plain URL
    res.json({ success: true, certId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Verify certificate by certId
router.get("/verify/:certId", async (req, res) => {
  try {
    const { certId } = req.params;
    const certificate = await Certificate.findOne({ certId });

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.json({ success: true, certificate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const certs = await Certificate.find();

    // Map over certificates and fetch PDF from IPFS if ipfsHash exists
    const certsWithPreview = await Promise.all(
      certs.map(async (cert) => {
        let pdfBase64 = null;
        if (cert.ipfsHash) {
          try {
            const ipfsUrl = `https://ipfs.io/ipfs/${cert.ipfsHash}`;
            const response = await axios.get(ipfsUrl, { responseType: "arraybuffer" });
            const buffer = Buffer.from(response.data, "binary");
            pdfBase64 = `data:application/pdf;base64,${buffer.toString("base64")}`;
          } catch (err) {
            console.error(`Failed to fetch PDF from IPFS for certId ${cert.certId}`, err);
          }
        }
        return {
          ...cert.toObject(),
          pdfPreview: pdfBase64, // null if not available
        };
      })
    );

    res.json({ success: true, certificates: certsWithPreview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
