const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide visitor name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  company: {
    type: String,
    required: [true, 'Please provide company name']
  },
  purpose: {
    type: String,
    required: [true, 'Please provide purpose of visit']
  },
  hostEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide host employee']
  },
  photo: {
    type: String,
    required: [true, 'Please provide visitor photo']
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'checked-in', 'checked-out'],
    default: 'pending'
  },
  qrCode: {
    type: String
  },
  preApproved: {
    type: Boolean,
    default: false
  },
  preApprovalDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visitor', visitorSchema); 