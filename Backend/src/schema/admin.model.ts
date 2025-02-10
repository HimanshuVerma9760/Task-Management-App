import mongoose from 'mongoose';

export const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
