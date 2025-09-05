// const express = require("express");
// const router = express.Router();
// const Certificate = require("../models/Certificate");
// const QRCode = require("qrcode");
// const axios = require("axios"); // since you're using it in /all
// const FormData = require("form-data");


// // Create certificate and return QR code
// router.post("/create", async (req, res) => {
//   try {
//     const { name, usn, courseTitle, type, start, end, issuedDate, signatory } = req.body;

//     // Validate required fields
//     if (!name || !usn || !courseTitle || !type || !start || !end || !issuedDate || !signatory) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     // Generate random 6-digit certId
//     const certId = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save certificate metadata in DB
//     const certificate = new Certificate({
//       certId,
//       name,
//       usn,
//       courseTitle,
//       type,
//       start,
//       end,
//       issuedDate,
//       signatory,
//       ipfsHash:""
//     });
//     await certificate.save();

//     // Return plain URL
//     res.json({ success: true, certId });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// router.post("/upload", async (req, res) => {
//   try {
//     const { certificateId, pdfBase64 } = req.body;

//     if (!certificateId) return res.status(400).json({ success: false, message: "Certificate ID is required" });
//     if (!pdfBase64) return res.status(400).json({ success: false, message: "PDF Base64 is required" });

//     const pdfBuffer = Buffer.from(pdfBase64, "base64");

//     const form = new FormData();
//     form.append("file", pdfBuffer, "certificate.pdf");

//     const pinataResponse = await axios.post(
//       "https://api.pinata.cloud/pinning/pinFileToIPFS",
//       form,
//       {
//         maxBodyLength: "Infinity",
//         headers: {
//           ...form.getHeaders(),
//           pinata_api_key: process.env.PINATA_API_KEY,
//           pinata_secret_api_key: process.env.PINATA_API_SECRET,
//         },
//       }
//     );

//     const ipfsHash = pinataResponse.data.IpfsHash;
//     const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

//     // Update DB using numeric certId
//     await Certificate.findOneAndUpdate({ certId: certificateId }, { ipfsHash });

//     res.json({ success: true, ipfsHash, ipfsUrl });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message || "Pinata upload failed" });
//   }
// });

// // GET /api/certificates/all
// router.get("/all", async (req, res) => {
//   try {
//     const certificates = await Certificate.find({
//       ipfsHash: { $exists: true, $nin: [null, ""] }, // non-empty strings only
//     });

//     if (!certificates.length)
//       return res.status(404).json({ success: false, message: "No certificates found" });

//     const result = certificates.map((cert) => ({
//       id: cert._id,
//       certId: cert.certId,
//       name: cert.name,
//       courseTitle: cert.courseTitle,
//       type: cert.type,
//       ipfsUrl: `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`, // public gateway
//     }));

//     res.json({ success: true, certificates: result });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // ✅ Verify certificate by certId
// router.get("/verify/:certId", async (req, res) => {
//   try {
//     const { certId } = req.params;
//     const certificate = await Certificate.findOne({ certId });

//     if (!certificate) {
//       return res.status(404).json({ success: false, message: "Certificate not found" });
//     }

//     res.json({ success: true, certificate });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// // routes/certificateRoutes.js
// router.get("/:certId", async (req, res) => {
//   try {
//     const cert = await Certificate.findOne({ certId: req.params.certId });
//     if (!cert) return res.status(404).json({ success: false, message: "Not found" });
//     res.json({ success: true, cert });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });


// module.exports = router;


const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const Request = require("../models/Request"); // ✅ added
const axios = require("axios");
const FormData = require("form-data");

// ---------------------- REQUEST ROUTES ---------------------- //

// User submits a request
router.post("/requests", async (req, res) => {
  try {
    const { name, usn, courseTitle, type, start, end, signatory } = req.body;

    if (!name || !usn || !courseTitle || !type || !start || !end || !signatory) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newRequest = new Request({
      name,
      usn,
      courseTitle,
      type,
      start,
      end,
      signatory,
    });

    await newRequest.save();
    res.json({ success: true, request: newRequest });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin fetches all requests
router.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin approves a request → creates certificate
router.put("/requests/:id/approve", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // Mark request as approved
    request.status = "approved";
    await request.save();

    // Generate random 6-digit certId
    const certId = Math.floor(100000 + Math.random() * 900000).toString();

    const certificate = new Certificate({
      certId,
      name: request.name,
      usn: request.usn,
      courseTitle: request.courseTitle,
      type: request.type,
      start: request.start,
      end: request.end,
      issuedDate: new Date().toISOString().split("T")[0], // today
      signatory: request.signatory,
      ipfsHash: ""
    });

    await certificate.save();

    res.json({ success: true, certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------- CERTIFICATE ROUTES ---------------------- //

// Create certificate manually (not from request)
router.post("/create", async (req, res) => {
  try {
    const { name, usn, courseTitle, type, start, end, issuedDate, signatory } = req.body;

    if (!name || !usn || !courseTitle || !type || !start || !end || !issuedDate || !signatory) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const certId = Math.floor(100000 + Math.random() * 900000).toString();

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
      ipfsHash: ""
    });
    await certificate.save();

    res.json({ success: true, certId });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload certificate PDF to IPFS (Pinata)
router.post("/upload", async (req, res) => {
  try {
    const { certificateId, pdfBase64 } = req.body;

    if (!certificateId) return res.status(400).json({ success: false, message: "Certificate ID is required" });
    if (!pdfBase64) return res.status(400).json({ success: false, message: "PDF Base64 is required" });

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
    res.status(500).json({ success: false, message: err.message || "Pinata upload failed" });
  }
});

// Get all certificates with IPFS hash
router.get("/all", async (req, res) => {
  try {
    const certificates = await Certificate.find({
      ipfsHash: { $exists: true, $nin: [null, ""] },
    });

    if (!certificates.length) {
      return res.status(404).json({ success: false, message: "No certificates found" });
    }

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

// Verify certificate by certId
router.get("/verify/:certId", async (req, res) => {
  try {
    const { certId } = req.params;
    const certificate = await Certificate.findOne({ certId });

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.json({ success: true, certificate });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get certificate by certId
router.get("/:certId", async (req, res) => {
  try {
    const cert = await Certificate.findOne({ certId: req.params.certId });
    if (!cert) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, cert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
