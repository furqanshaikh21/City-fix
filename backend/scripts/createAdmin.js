// scripts/createAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

dotenv.config(); // Loads .env variables like MONGO_URI

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('❌ Admin already exists');
      process.exit();
    }

    const admin = new Admin({
      username: 'admin', // change if needed
      password: 'YourSecurePassword123', // change if needed
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
