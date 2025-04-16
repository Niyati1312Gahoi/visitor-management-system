// controllers/adminController.js
const Visit = require('../models/Visit');
const PreApproval = require('../models/PreApproval');
const User = require('../models/User');
const generateQR = require('../utils/generateQR');
const generatePasscode = require('../utils/generatePasscode');
const sendEmail = require('../utils/sendEmail');

// Get all visits
exports.getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('visitor', 'name email company photoUrl')
      .sort({ visitDate: -1 });
      
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get visits by status
exports.getVisitsByStatus = async (req, res) => {
  const { status } = req.params;
  
  try {
    const visits = await Visit.find({ status })
      .populate('visitor', 'name email company photoUrl')
      .sort({ visitDate: -1 });
      
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get visits for today
exports.getTodayVisits = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const visits = await Visit.find({ 
      visitDate: { $gte: startOfDay, $lte: endOfDay } 
    })
      .populate('visitor', 'name email company photoUrl')
      .sort({ visitDate: 1 });
      
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Approve or reject visit
exports.updateVisitStatus = async (req, res) => {
  const { visitId } = req.params;
  const { status, notes } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  
  try {
    const visit = await Visit.findById(visitId);
    
    if (!visit) {
      return res.status(404).json({ msg: 'Visit not found' });
    }
    
    if (visit.status !== 'pending') {
      return res.status(400).json({ msg: 'Visit is not in pending status' });
    }
    
    visit.status = status;
    visit.notes = notes;
    visit.approvedBy = req.user.id;
    
    await visit.save();
    
    // Get visitor details
    const visitor = await User.findById(visit.visitor);
    
    // Send email notification to visitor
    if (visitor && visitor.email) {
      await sendEmail(
        visitor.email,
        `Visit Request ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        `Your visit request for ${new Date(visit.visitDate).toLocaleString()} has been ${status}.\n
        ${status === 'approved' ? `Your passcode is: ${visit.passcode}` : ''}
        ${notes ? `Notes: ${notes}` : ''}`
      );
    }
    
    res.json(visit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a pre-approval
exports.createPreApproval = async (req, res) => {
  const { visitorName, visitorEmail, visitorPhone, visitorCompany, host, purpose, validFrom, validUntil } = req.body;
  
  try {
    // Generate passcode and QR code
    const passcode = generatePasscode();
    const qrCode = await generateQR(passcode);
    
    const preApproval = new PreApproval({
      visitorName,
      visitorEmail,
      visitorPhone,
      visitorCompany,
      host,
      purpose,
      validFrom,
      validUntil,
      passcode,
      qrCode,
      createdBy: req.user.id
    });
    
    await preApproval.save();
    
    // Send email to visitor
    await sendEmail(
      visitorEmail,
      'Pre-approved Visit',
      `You have been pre-approved for a visit from ${new Date(validFrom).toLocaleDateString()} to ${new Date(validUntil).toLocaleDateString()}.\n
      Purpose: ${purpose}\n
      Host: ${host.name}, ${host.department}\n
      Your passcode is: ${passcode}\n
      Please show this code or the attached QR code upon arrival.`
    );
    
    res.json(preApproval);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all pre-approvals
exports.getAllPreApprovals = async (req, res) => {
  try {
    const preApprovals = await PreApproval.find()
      .populate('createdBy', 'name')
      .sort({ created: -1 });
      
    res.json(preApprovals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update pre-approval status
exports.updatePreApprovalStatus = async (req, res) => {
  const { preApprovalId } = req.params;
  const { status } = req.body;
  
  if (!['active', 'cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  
  try {
    const preApproval = await PreApproval.findById(preApprovalId);
    
    if (!preApproval) {
      return res.status(404).json({ msg: 'Pre-approval not found' });
    }
    
    preApproval.status = status;
    await preApproval.save();
    
    // Notify visitor if cancelled
    if (status === 'cancelled' && preApproval.visitorEmail) {
      await sendEmail(
        preApproval.visitorEmail,
        'Pre-approval Cancelled',
        `Your pre-approved visit for ${new Date(preApproval.validFrom).toLocaleDateString()} to ${new Date(preApproval.validUntil).toLocaleDateString()} has been cancelled.\n
        Please contact your host for more information.`
      );
    }
    
    res.json(preApproval);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ created: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  
  if (!['visitor', 'admin'].includes(role)) {
    return res.status(400).json({ msg: 'Invalid role' });
  }
  
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ msg: `User role updated to ${role}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
