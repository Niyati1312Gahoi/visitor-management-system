// controllers/visitorController.js
const Visit = require('../models/Visit');
const PreApproval = require('../models/PreApproval');
const User = require('../models/User');
const generateQR = require('../utils/generateQR');
const generatePasscode = require('../utils/generatePasscode');
const sendEmail = require('../utils/sendEmail');

// Create a new visit request
exports.createVisit = async (req, res) => {
  const { host, purpose, visitDate } = req.body;

  try {
    // Generate QR and passcode
    const passcode = generatePasscode();
    const qrCode = await generateQR(passcode);

    const visit = new Visit({
      visitor: req.user.id,
      host,
      purpose,
      visitDate,
      passcode,
      qrCode
    });

    await visit.save();

    // Notify host via email
    if (host.email) {
      await sendEmail(
        host.email,
        'New Visit Request',
        `You have a new visit request from ${req.user.name} for ${new Date(visitDate).toLocaleString()}.\nPurpose: ${purpose}`
      );
    }

    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all visits for current visitor
exports.getMyVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ visitor: req.user.id }).sort({ visitDate: -1 });
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Check-in visitor using QR/passcode
exports.checkIn = async (req, res) => {
  const { passcode } = req.body;

  try {
    // First check for regular visits
    let visit = await Visit.findOne({ 
      passcode, 
      status: 'approved',
      visitDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }  // Today or future
    });

    // If not found, check for pre-approvals
    if (!visit) {
      const preApproval = await PreApproval.findOne({
        passcode,
        status: 'active',
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (preApproval) {
        // Create a visit from pre-approval
        visit = new Visit({
          visitor: req.user.id,
          host: preApproval.host,
          purpose: preApproval.purpose,
          status: 'approved',
          visitDate: new Date(),
          passcode: preApproval.passcode,
          qrCode: preApproval.qrCode
        });

        // Update pre-approval status
        preApproval.status = 'used';
        await preApproval.save();
      }
    }

    if (!visit) {
      return res.status(404).json({ msg: 'Invalid or expired passcode' });
    }

    // Update visit status
    visit.status = 'checked-in';
    visit.checkInTime = new Date();
    await visit.save();

    // Notify host
    if (visit.host && visit.host.email) {
      await sendEmail(
        visit.host.email,
        'Visitor Check-in Notification',
        `${req.user.name} has checked in at ${new Date().toLocaleString()}.`
      );
    }

    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Check-out visitor
exports.checkOut = async (req, res) => {
  const { visitId } = req.params;

  try {
    const visit = await Visit.findOne({ 
      _id: visitId,
      visitor: req.user.id,
      status: 'checked-in' 
    });

    if (!visit) {
      return res.status(404).json({ msg: 'Visit not found or not checked in' });
    }

    // Update visit status
    visit.status = 'checked-out';
    visit.checkOutTime = new Date();
    await visit.save();

    // Notify host
    if (visit.host && visit.host.email) {
      await sendEmail(
        visit.host.email,
        'Visitor Check-out Notification',
        `${req.user.name} has checked out at ${new Date().toLocaleString()}.`
      );
    }

    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
