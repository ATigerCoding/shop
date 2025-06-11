import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  picture:  String,
  category: String
});
   
export default mongoose.model('Product', productSchema); 