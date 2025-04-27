const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request',
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PickupLocation',
    required: true
  },
  dropOffTime: {
    type: Date,
    required: true
  },
  actualDropOffTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'dropped_off', 'completed'],
    default: 'pending'
  },
  confirmationCode: {
    type: String
  },
  messages: [{
    content: String,
    isFromDonor: Boolean,
    isSystemMessage: Boolean,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation; 