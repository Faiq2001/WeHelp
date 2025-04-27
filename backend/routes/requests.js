// routes/requests.js
const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const auth = require('../middleware/auth');

// Get all requests (for donors)
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' })
      .populate('requester.userId', 'name');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Get my requests (for receivers)
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Request.find({ 'requester.userId': req.user.userId });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your requests' });
  }
});

// Create a new request (for receivers)
router.post('/', auth, async (req, res) => {
  try {
    const { item, description, isAnonymous } = req.body;

    const request = new Request({
      item,
      description,
      requester: {
        userId: req.user.userId,
        name: isAnonymous ? 'Anonymous' : req.user.name,
        isAnonymous
      },
      status: 'pending'
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request' });
  }
});

// Get a specific request
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester.userId', 'name');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request' });
  }
});

// Update a request
router.patch('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findOne({ 
      _id: req.params.id,
      requester: req.user.userId 
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'requester' && key !== '_id') {
        request[key] = updates[key];
      }
    });

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a request
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({
      _id: req.params.id,
      requester: req.user.userId
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;