import mongoose, { Schema } from 'mongoose';

export const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDetail: {
    type: String,
    required: true,
  },
  taskDate: {
    type: Date,
    required: true,
  },
  taskPriority: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
