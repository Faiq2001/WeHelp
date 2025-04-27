const mongoose = require('mongoose');

const pickupLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const PickupLocation = mongoose.model('PickupLocation', pickupLocationSchema);

module.exports = PickupLocation; 