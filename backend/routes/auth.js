const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP
router.post('/request-otp', async (req, res) => {
  try {
    const { mobile } = req.body;
    
    // Generate OTP and set expiry to 10 minutes
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Find or create user
    let user = await User.findOne({ mobile });
    if (!user) {
      user = new User({ mobile });
    }

    user.otp = {
      code: otp,
      expiresAt
    };

    await user.save();

    // In a real app, you would integrate with an SMS service here
    // For hackathon demo, we'll just send the OTP in response
    res.json({ 
      message: 'OTP sent successfully',
      otp: otp // Remove this in production!
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: 'No OTP requested' });
    }

    if (Date.now() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({ 
      message: 'OTP verified successfully',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Donor registration
router.post('/donor/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new donor
    const user = new User({
      name,
      email,
      password,
      userType: 'donor'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, userType: 'donor' },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Donor registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Donor login
router.post('/donor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, userType: 'donor' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, userType: 'donor' },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Send OTP to receiver
router.post('/receiver/send-otp', async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create user
    let user = await User.findOne({ mobileNumber, userType: 'receiver' });
    if (!user) {
      user = new User({
        name: `User-${mobileNumber.slice(-4)}`, // Temporary name
        mobileNumber,
        userType: 'receiver'
      });
    }

    // Update OTP
    user.otp = {
      code: otp,
      expiresAt: otpExpiry
    };
    await user.save();

    // In a real application, you would send the OTP via SMS
    // For development, we'll just send it in the response
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP and login receiver
router.post('/receiver/verify-otp', async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: 'Please provide mobile number and OTP' });
    }

    console.log('Verifying OTP for mobile:', mobileNumber, 'OTP:', otp);

    // Find user
    const user = await User.findOne({ mobileNumber, userType: 'receiver' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user._id, 'OTP data:', user.otp);

    // Verify OTP
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (Date.now() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp.code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Clear OTP
    user.otp = undefined;
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, userType: 'receiver' },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

module.exports = router; 