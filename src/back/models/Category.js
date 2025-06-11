import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name:  String,
  pid: String,
  level: Number
});

export default mongoose.model('Category', categorySchema);