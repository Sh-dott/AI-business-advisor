// Technology Model
const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide technology name'],
    unique: true,
    trim: true
  },

  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: [
      'CRM & Customer Management',
      'E-commerce',
      'Scheduling',
      'Marketing',
      'Website Builder',
      'Payments',
      'Management & Productivity',
      'Analytics',
      'Accounting',
      'Project Management',
      'Communication',
      'Security',
      'Other'
    ]
  },

  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: 1000
  },

  features: [{
    type: String,
    description: 'Detailed features list'
  }],

  problemsSolved: [{
    type: String,
    description: 'Business problems this technology addresses'
  }],

  pricing: {
    free: {
      type: Boolean,
      default: false
    },
    monthly: {
      type: Number,
      description: 'Monthly cost in USD'
    },
    perTransaction: {
      type: Number,
      description: 'Per transaction cost (percentage or fixed)'
    },
    description: String
  },

  complexity: {
    type: Number,
    min: 1,
    max: 10,
    description: 'Implementation complexity (1-10)'
  },

  setupTimeHours: {
    type: Number,
    description: 'Estimated setup time in hours'
  },

  bestFor: [{
    type: String,
    enum: [
      'retail',
      'services',
      'restaurant',
      'health',
      'freelance',
      'manufacturing',
      'education',
      'nonprofit'
    ]
  }],

  aiKeywords: [{
    type: String,
    description: 'Keywords AI uses to match this technology'
  }],

  implementationSteps: [{
    step: Number,
    title: String,
    description: String
  }],

  link: {
    type: String,
    match: [
      /^https?:\/\/.+/,
      'Please provide a valid URL'
    ]
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  reviewsCount: {
    type: Number,
    default: 0
  },

  popularity: {
    type: Number,
    default: 0,
    description: 'How often recommended (0-100)'
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search and filtering
technologySchema.index({ name: 'text', description: 'text', aiKeywords: 'text' });
technologySchema.index({ category: 1 });
technologySchema.index({ bestFor: 1 });
technologySchema.index({ problemsSolved: 1 });

module.exports = mongoose.model('Technology', technologySchema);
