const mongoose = require('mongoose');
const PickupLocation = require('./models/PickupLocation');
require('dotenv').config();

const seedLocations = [
  {
    name: 'Downtown Community Center',
    address: '123 Main St, San Jose, CA 95112',
    coordinates: {
      latitude: 37.3382,
      longitude: -121.8863
    }
  },
  {
    name: 'SJSU Student Union',
    address: '211 South 9th Street, San Jose, CA 95192',
    coordinates: {
      latitude: 37.3366,
      longitude: -121.8805
    }
  },
  {
    name: 'MLK Library',
    address: '150 E San Fernando St, San Jose, CA 95112',
    coordinates: {
      latitude: 37.3352,
      longitude: -121.8852
    }
  }
];

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(async () => {
  console.log('Connected to MongoDB Atlas');
  
  try {
    // Clear existing locations
    await PickupLocation.deleteMany({});
    console.log('Cleared existing pickup locations');
    
    // Insert new locations
    await PickupLocation.insertMany(seedLocations);
    console.log('Pickup locations seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 