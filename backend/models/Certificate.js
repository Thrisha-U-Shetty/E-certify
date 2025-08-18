const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Certificate name
  hash: { type: String, required: true, unique: true }, // SHA-256 hash of file
  issuedBy: { type: String, required: true },      // User’s name (issuer)
  verified: { type: Boolean, default: false },     // Admin verification flag
  uploadedOn: { type: Date, default: Date.now },   // Timestamp
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Owner
});

module.exports = mongoose.model('Certificate', certificateSchema);
