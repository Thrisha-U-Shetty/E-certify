import express from "express";
import Request from "../models/Request.js";   
import Certificate from "../models/Certificate.js";
import { verifyToken } from "../middleware/verifyToken.js";
// include .js extension in ESM

const router = express.Router();

// ---------------------- REQUEST ROUTES ---------------------- //

// User submits a request
router.post("/create", async (req, res) => {
  try {
    const { name, usn, courseTitle, type, start, end, signatory } = req.body;

    if (!name || !usn || !courseTitle || !type || !start || !end || !signatory) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
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

// Admin fetches all pending requests
router.get("/all", async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a request by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    await Request.findByIdAndDelete(id);
    res.json({ success: true, message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Approve request
router.put("/:id/approve", async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.json({
      success: true,
      message: "Request approved successfully",
      request,
    });
  } catch (err) {
    console.error("Error approving request:", err);
    res.status(500).json({
      success: false,
      message: "Failed to approve request",
    });
  }
});

router.get("/user", verifyToken, async (req, res) => {
  try {
    // 🔹 Extract name from token (set by verifyToken middleware)
    const userName = req.userName;
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "Name not found in token",
      });
    }

    // 🔹 Fetch certificates from DB for this user
    const certificates = await Certificate.find({
      name: { $regex: new RegExp(`^${userName}$`, "i") }, // case-insensitive
      ipfsHash: { $exists: true, $nin: [null, ""] },
    });

    if (!certificates.length) {
      return res.status(404).json({
        success: false,
        message: `No certificates found for user: ${userName}`,
      });
    }

    // 🔹 Format and send response
    const result = certificates.map((cert) => ({
      certId: cert.certId,
      name: cert.name,
      eventTitle: cert.courseTitle || cert.eventTitle,
      fileUrl: `https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`,
    }));

    res.json({ success: true, certificates: result });
  } catch (err) {
    console.error("Error fetching user certificates:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router;
