const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json({ data: visitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visitor by ID
router.get('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json({ data: visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create visitor
router.post('/', async (req, res) => {
  try {
    const visitor = new Visitor(req.body);
    await visitor.save();
    res.status(201).json({ data: visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update visitor
router.put('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json({ data: visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete visitor
router.delete('/:id', async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json({ message: 'Visitor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get visitor statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching visitor stats...');
    
    // Check if MongoDB is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB is not connected');
      return res.status(500).json({ 
        message: 'Database connection error',
        error: 'MongoDB is not connected'
      });
    }

    // Try to get a count first to verify collection access
    const totalCount = await Visitor.countDocuments();
    console.log('Total visitors count:', totalCount);

    const stats = await Visitor.aggregate([
      {
        $group: {
          _id: null,
          totalVisitors: { $sum: 1 },
          pendingVisitors: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          checkedInVisitors: {
            $sum: { $cond: [{ $eq: ['$status', 'checked-in'] }, 1, 0] }
          },
          rejectedVisitors: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    console.log('Aggregation result:', stats);

    // If no documents exist, return default values
    if (!stats || stats.length === 0) {
      console.log('No visitors found, returning default stats');
      return res.json({
        totalVisitors: 0,
        pendingVisitors: 0,
        checkedInVisitors: 0,
        rejectedVisitors: 0
      });
    }

    res.json(stats[0]);
  } catch (err) {
    console.error('Error in stats endpoint:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router; 