// ChatMessage Model
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: [true, 'Message must belong to an analysis']
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Message must belong to a user']
  },

  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: [true, 'Please specify message role']
  },

  content: {
    type: String,
    required: [true, 'Please provide message content'],
    maxlength: 5000
  },

  metadata: {
    tokensUsed: Number,
    model: String,
    provider: {
      type: String,
      enum: ['claude', 'openai']
    }
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
chatMessageSchema.index({ analysisId: 1, timestamp: 1 });
chatMessageSchema.index({ userId: 1, timestamp: -1 });

// Auto-delete messages older than 90 days
chatMessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
