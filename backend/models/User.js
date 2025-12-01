// User Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },

  businessName: {
    type: String,
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },

  businessType: {
    type: String,
    enum: [
      'retail',
      'services',
      'restaurant',
      'health',
      'freelance',
      'manufacturing',
      'education',
      'nonprofit',
      'other'
    ]
  },

  apiProvider: {
    type: String,
    enum: ['claude', 'openai'],
    default: 'claude',
    description: 'User preference for AI provider'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  lastActiveAt: {
    type: Date,
    default: Date.now
  },

  isActive: {
    type: Boolean,
    default: true
  }
});

// Note: Password hashing removed since we don't use authentication
// All requests are stateless - users get Word document exports directly

// Compare password method (placeholder)
userSchema.methods.comparePassword = async function (password) {
  return password === this.password;
};

module.exports = mongoose.model('User', userSchema);
