// models/Skill.js
const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: String,
  description: String,
});

module.exports = mongoose.model('Skill', SkillSchema);