const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, required: true },
  courseTitle: { type: String, required: true },
  type: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  signatory: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending | approved | rejected
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);
