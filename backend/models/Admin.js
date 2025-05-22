// models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // 🔧 this was the previous bug
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model('Admin', adminSchema);
