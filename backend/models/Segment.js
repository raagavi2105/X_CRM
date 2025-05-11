const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  criteria: {
    field: {
      type: String,
      required: true,
      enum: ['totalSpend', 'visits', 'lastActive']
    },
    operator: {
      type: String,
      required: true,
      enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'between']
    },
    value: {
      type: String,
      required: true
    }
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

// Update the updatedAt timestamp before saving
segmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Segment', segmentSchema); 