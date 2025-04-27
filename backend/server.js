// server.js (Backend Entry Point)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const donationRoutes = require('./routes/donations');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wehelp', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => app.listen(5000, () => console.log('Connected to DB & Server running on port 5000')))
.catch((err) => console.error(err));