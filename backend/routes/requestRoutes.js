const express = require("express");
const router = express.Router();
const Request = require("../models/Request"); 


// ---------------------- REQUEST ROUTES ---------------------- //

// User submits a request
router.post("/create", async (req, res) => {
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

    // Find the request by MongoDB _id
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



module.exports = router;
