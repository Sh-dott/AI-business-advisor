// Analysis Model
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Analysis must belong to a user']
  },

  initialDescription: {
    type: String,
    required: [true, 'Please provide initial business description'],
    minlength: 10,
    maxlength: 5000
  },

  aiDiagnosis: {
    type: String,
    description: 'Raw AI diagnostic response'
  },

  identifiedProblems: [{
    type: String,
    description: 'Business problems identified by AI'
  }],

  solutionCategories: [{
    type: String,
    description: 'Recommended solution categories from AI'
  }],

  chatHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  recommendations: [{
    techId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Technology'
    },
    name: String,
    category: String,
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    baseScore: {
      type: Number,
      description: 'Static algorithm score'
    },
    aiScore: {
      type: Number,
      description: 'AI relevance score'
    },
    matchReason: {
      type: String,
      description: 'Why AI recommends this tech'
    },
    implementationPlan: {
      type: String,
      description: 'AI-generated implementation steps'
    }
  }],

  apiProvider: {
    type: String,
    enum: ['claude', 'openai'],
    default: 'claude'
  },

  status: {
    type: String,
    enum: ['in_progress', 'completed', 'error'],
    default: 'in_progress'
  },

  metadata: {
    businessType: String,
    teamSize: String,
    budget: String,
    techLevel: String
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

// Auto-update updatedAt on save
analysisSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
analysisSchema.index({ userId: 1, createdAt: -1 });
analysisSchema.index({ status: 1 });

module.exports = mongoose.model('Analysis', analysisSchema);
