const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'visitor'],
    default: 'visitor'
  },
  department: {
    type: String,
    validate: {
      validator: function(v) {
        if (this.role === 'visitor') {
          return true; // Allow any value (including undefined) for visitors
        }
        return v && v.length > 0; // Require non-empty string for admin
      },
      message: props => `Department is required for admin role`
    },
    default: 'None'
  },
  permissions: {
    type: [String],
    default: function() {
      switch (this.role) {
        case 'admin':
          return ['manage_users', 'manage_visitors', 'view_reports', 'manage_settings'];
        case 'visitor':
          return ['view_own_profile'];
        default:
          return [];
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 