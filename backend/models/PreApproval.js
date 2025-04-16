// models/PreApproval.js
const mongoose = require('mongoose');

const PreApprovalSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: true
  },
  visitorEmail: {
    type: String,
    required: true
  },
  visitorPhone: {
    type: String
  },
  visitorCompany: {
    type: String
  },
  host: {
    name: String,
    email: String,
    department: String
  },
  purpose: {
    type: String,
    required: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  passcode: {
    type: String
  },
  qrCode: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired', 'cancelled'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PreApproval', PreApprovalSchema);
