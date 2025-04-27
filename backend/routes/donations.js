const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Request = require('../models/Request');
const User = require('../models/User');
const PickupLocation = require('../models/PickupLocation');
const auth = require('../middleware/auth');

// Get all pickup locations
router.get('/pickup-locations', async (req, res) => {
  try {
    const locations = await PickupLocation.find({ isActive: true });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pickup locations' });
  }
});

// Create a donation
router.post('/', auth, async (req, res) => {
  try {
    const { requestId, pickupLocation, dropOffTime } = req.body;
    const userId = req.user.userId;

    // First check if the request exists and is still pending
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been claimed' });
    }

    // Create the donation
    const donation = new Donation({
      requestId,
      donorId: userId,
      pickupLocation,
      dropOffTime,
      status: 'pending'
    });

    // Update request status to claimed
    request.status = 'claimed';
    
    // Save both documents
    await Promise.all([
      donation.save(),
      request.save()
    ]);

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation' });
  }
});

// Get user's donations
router.get('/my-donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.userId })
      .populate('requestId')
      .populate('pickupLocation');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

// Confirm donation drop-off
router.post('/:id/drop-off', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Verify that the logged-in user is the donor
    if (donation.donorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to confirm this donation' });
    }

    // Generate confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    donation.status = 'dropped_off';
    donation.confirmationCode = confirmationCode;
    donation.actualDropOffTime = new Date();
    
    await donation.save();

    // Send notification to recipient (in a real app)
    
    res.json({ 
      message: 'Drop-off confirmed',
      confirmationCode
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Verify pickup code and complete donation
router.post('/:id/complete', async (req, res) => {
  try {
    const { pickupCode } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (!donation.pickupCode || !donation.pickupCode.code) {
      return res.status(400).json({ message: 'No pickup code found' });
    }

    if (Date.now() > donation.pickupCode.expiresAt) {
      return res.status(400).json({ message: 'Pickup code has expired' });
    }

    if (donation.pickupCode.code !== pickupCode) {
      return res.status(400).json({ message: 'Invalid pickup code' });
    }

    donation.status = 'completed';
    await donation.save();

    // Update request status
    const request = await Request.findById(donation.requestId);
    if (request) {
      request.status = 'completed';
      await request.save();
    }

    res.json({ message: 'Donation completed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add message to donation thread
router.post('/:id/messages', async (req, res) => {
  try {
    const { content, isFromDonor } = req.body;
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.messages.push({
      content,
      isFromDonor,
      isSystemMessage: false
    });

    await donation.save();
    res.json(donation.messages[donation.messages.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 