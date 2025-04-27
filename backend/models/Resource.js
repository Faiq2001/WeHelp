// models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  name: String,
  type: String, // shelter, clinic, food service
  location: String,
});

module.exports = mongoose.model('Resource', ResourceSchema);