const mongoose = require('mongoose');

const certificateRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  usn: {
    type: String,
    required: true,
    maxlength: 10,
    uppercase: true
  },
  courseTitle: {
    type: String,
    required: true,
    maxlength: 70
  },
  type: {
    type: String,
    required: true,
    enum: ['Workshop', 'Hackathon', 'Technical Event', 'Cultural Event']
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  signatory: {
    type: String,
    required: true,
    enum: ['cultural', 'technical', 'hod', 'principal']
  }
});

module.exports = mongoose.model('CertificateRequest', certificateRequestSchema);