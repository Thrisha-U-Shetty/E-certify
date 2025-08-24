// backend/models/Certificate.js
const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  usn: { type: String, required: true },
  courseTitle: { type: String, required: true },
  type: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  issuedDate: { type: Date, required: true },
  signatory: { type: String, required: true },
  ipfsHash: { type: String , default:""} // optional, updated after PDF upload
});

module.exports = mongoose.model("Certificate", CertificateSchema);
