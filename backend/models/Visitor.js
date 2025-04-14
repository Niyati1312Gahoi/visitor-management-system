const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  hostEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'checked-in', 'checked-out', 'rejected'],
    default: 'pending'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  photo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visitor', VisitorSchema); 