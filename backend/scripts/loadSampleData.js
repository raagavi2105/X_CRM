require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Customer = require('../models/Customer');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const loadSampleData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Read sample data
    const sampleData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../sample_data/customers.json'), 'utf8')
    );

    // Clear existing data
    await Customer.deleteMany({});

    // Insert sample data
    await Customer.insertMany(sampleData);

    console.log('Sample data loaded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error loading sample data:', err);
    process.exit(1);
  }
};

loadSampleData(); 