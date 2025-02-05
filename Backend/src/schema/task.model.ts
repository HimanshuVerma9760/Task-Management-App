import mongoose from 'mongoose';
import { type } from 'os';

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
});
