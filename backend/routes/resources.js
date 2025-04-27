// routes/resources.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

router.get('/', async (req, res) => {
  const resources = await Resource.find();
  res.json(resources);
});

module.exports = router;