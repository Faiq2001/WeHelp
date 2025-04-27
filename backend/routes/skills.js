// routes/skills.js
const express = require('express');
const router = express.Router();
const Skill = require('../models/Skills');

router.post('/', async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.json(skill);
});

module.exports = router;