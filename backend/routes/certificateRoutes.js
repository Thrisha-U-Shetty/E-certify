const express = require("express");
const Certificate = require("../models/Certificate");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Upload certificate
router.post("/upload", protect, async (req, res) => {
  try {
    const { name, hash } = req.body;

    if (!name || !hash) {
      return res.status(400).json({ error: "Missing fields (name, hash)" });
    }

    const existing = await Certificate.findOne({ hash });
    if (existing) {
      return res.status(400).json({ error: "Certificate already exists" });
    }

    const cert = await Certificate.create({
      name,
      hash,
      issuedBy: req.user.name,
      userId: req.user._id,
    });

    res.status(201).json(cert);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin verify certificate
router.put("/verify/:id", protect, admin, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ error: "Not found" });

    cert.verified = true;
    await cert.save();
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
