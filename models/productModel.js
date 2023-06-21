import mongoose from 'mongoose';

const productModel = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.ObjectId,
    ref: 'categories',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  photo: {
    data: Buffer,
    contentType: String,

  },
  shipping: {
    type: Boolean,
  }
}, { timestamps: true })

export default mongoose.model("products", productModel)