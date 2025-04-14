const Visitor = require('../models/Visitor');
const User = require('../models/User');
const QRCode = require('qrcode');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// @desc    Register a new visitor
// @route   POST /api/visitors
// @access  Private
exports.registerVisitor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const visitor = await Visitor.create(req.body);

    // Generate QR code
    const qrCode = await QRCode.toDataURL(visitor._id.toString());
    visitor.qrCode = qrCode;
    await visitor.save();

    // Notify host employee
    const hostEmployee = await User.findById(visitor.hostEmployee);
    
    // Send email notification
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: hostEmployee.email,
      subject: 'New Visitor Registration',
      html: `
        <h2>New Visitor Registration</h2>
        <p>A new visitor has registered to meet you:</p>
        <ul>
          <li>Name: ${visitor.fullName}</li>
          <li>Company: ${visitor.company}</li>
          <li>Purpose: ${visitor.purpose}</li>
        </ul>
        <p>Please approve or reject this visit request.</p>
      `
    });

    // Send SMS notification
    await twilioClient.messages.create({
      body: `New visitor registration: ${visitor.fullName} from ${visitor.company} wants to meet you.`,
      to: hostEmployee.phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    res.status(201).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get all visitors
// @route   GET /api/visitors
// @access  Private
exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate('hostEmployee', 'name email department')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get single visitor
// @route   GET /api/visitors/:id
// @access  Private
exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate('hostEmployee', 'name email department');

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update visitor status
// @route   PUT /api/visitors/:id/status
// @access  Private
exports.updateVisitorStatus = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    visitor.status = req.body.status;
    await visitor.save();

    // Notify visitor about status change
    if (visitor.status === 'approved') {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: visitor.email,
        subject: 'Visit Request Approved',
        html: `
          <h2>Visit Request Approved</h2>
          <p>Your visit request has been approved. Please find your QR code below:</p>
          <img src="${visitor.qrCode}" alt="QR Code" />
        `
      });
    }

    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Check-in visitor
// @route   PUT /api/visitors/:id/checkin
// @access  Private
exports.checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    visitor.status = 'checked-in';
    visitor.checkInTime = Date.now();
    await visitor.save();

    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Check-out visitor
// @route   PUT /api/visitors/:id/checkout
// @access  Private
exports.checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitor not found'
      });
    }

    visitor.status = 'checked-out';
    visitor.checkOutTime = Date.now();
    await visitor.save();

    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}; 