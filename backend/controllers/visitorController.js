const Visitor = require('../models/Visitor');
const Employee = require('../models/Employee');
const { startOfDay, endOfDay } = require('date-fns');
const { format } = require('date-fns');

// Get visitor statistics
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const [
      totalVisitors,
      checkedInVisitors,
      pendingVisitors,
      checkedOutVisitors
    ] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ status: 'checked-in' }),
      Visitor.countDocuments({ status: 'pending' }),
      Visitor.countDocuments({
        status: 'checked-out',
        checkOutTime: { $gte: startOfToday, $lte: endOfToday }
      })
    ]);

    res.json({
      totalVisitors,
      checkedIn: checkedInVisitors,
      pending: pendingVisitors,
      checkedOut: checkedOutVisitors
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    res.status(500).json({ message: 'Error fetching visitor statistics' });
  }
};

// Get recent visitors
exports.getRecentVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('hostEmployee', 'name email')
      .select('fullName company photo status createdAt checkInTime checkOutTime');

    res.json({
      data: visitors
    });
  } catch (error) {
    console.error('Error fetching recent visitors:', error);
    res.status(500).json({ message: 'Error fetching recent visitors' });
  }
};

// Get active visitors
exports.getActiveVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      $or: [
        { status: 'checked-in' },
        { status: 'pending' }
      ]
    })
      .sort({ checkInTime: -1 })
      .populate('hostEmployee', 'name email')
      .select('fullName company photo status checkInTime hostEmployee');

    res.json({
      data: visitors
    });
  } catch (error) {
    console.error('Error fetching active visitors:', error);
    res.status(500).json({ message: 'Error fetching active visitors' });
  }
};

// Get visitor's own activities
exports.getVisitorActivities = async (req, res) => {
  try {
    const visitorId = req.user.visitorId; // Assuming visitor ID is stored in user object
    const activities = await Visitor.find({ _id: visitorId })
      .sort({ createdAt: -1 })
      .populate('hostEmployee', 'name email department')
      .select('name email phone purpose status checkInTime checkOutTime hostEmployee');

    res.json({
      data: activities
    });
  } catch (error) {
    console.error('Error fetching visitor activities:', error);
    res.status(500).json({ message: 'Error fetching visitor activities' });
  }
};

// Create a new visit request
exports.createVisitRequest = async (req, res) => {
  try {
    const { hostEmail, purpose, visitDate, visitTime } = req.body;
    
    // Find host employee
    const hostEmployee = await Employee.findOne({ email: hostEmail });
    if (!hostEmployee) {
      return res.status(404).json({ message: 'Host employee not found' });
    }

    // Create visit request
    const visitRequest = new Visitor({
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      purpose,
      visitDate,
      visitTime,
      hostEmployee: hostEmployee._id,
      status: 'pending',
      requestedBy: req.user._id
    });

    await visitRequest.save();

    res.status(201).json({
      message: 'Visit request created successfully',
      data: visitRequest
    });
  } catch (error) {
    console.error('Error creating visit request:', error);
    res.status(500).json({ message: 'Error creating visit request' });
  }
};

// Get pending visit requests
exports.getPendingRequests = async (req, res) => {
  try {
    const visitorId = req.user._id;
    const pendingRequests = await Visitor.find({
      requestedBy: visitorId,
      status: 'pending'
    })
      .sort({ createdAt: -1 })
      .populate('hostEmployee', 'name email department')
      .select('name email phone purpose status visitDate visitTime hostEmployee');

    res.json({
      data: pendingRequests
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Error fetching pending requests' });
  }
};

// Get visitor analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5); // Get data for last 5 years

    // Get first-time visitors per year
    const firstTimeVisitors = await Visitor.aggregate([
      {
        $group: {
          _id: {
            visitor: '$email',
            year: { $year: '$createdAt' }
          },
          firstVisit: { $min: '$createdAt' }
        }
      },
      {
        $group: {
          _id: { $year: '$firstVisit' },
          visitors: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: '$_id',
          visitors: 1
        }
      },
      { $sort: { year: 1 } }
    ]);

    // Get visitor types distribution
    const visitorTypes = await Visitor.aggregate([
      {
        $group: {
          _id: '$purpose',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly visitor growth
    const monthlyGrowth = await Visitor.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          visitors: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month'
            }
          },
          visitors: 1
        }
      },
      { $sort: { date: 1 } },
      { $limit: 12 }
    ]);

    // Get today's time logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeLogs = await Visitor.find({
      createdAt: { $gte: today }
    })
      .select('name checkInTime checkOutTime')
      .sort({ checkInTime: 1 });

    res.json({
      firstTimeVisitors,
      visitorTypes,
      monthlyGrowth,
      timeLogs: timeLogs.map(log => ({
        visitor: log.name,
        in: log.checkInTime ? format(new Date(log.checkInTime), 'h:mm a') : '-',
        out: log.checkOutTime ? format(new Date(log.checkOutTime), 'h:mm a') : '-'
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
}; 