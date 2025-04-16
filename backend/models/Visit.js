// models/Visit.js
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  visitDate: {
    type: Date,
    required: true
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  qrCode: {
    type: String
  },
  passcode: {
    type: String
  },
  notes: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visit', VisitSchema);