// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requester: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    mobile: String,
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['pending', 'claimed', 'completed', 'cancelled'],
    default: 'pending'
  },
  donor: {
    name: String,
    contact: String,
    email: String
  },
  pickupDetails: {
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupLocation'
    },
    dropOffTime: Date,
    pickupOTP: String,
    pickupOTPExpiry: Date,
    instructions: String
  }
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
