import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    depth: {
      type: Number,
    },
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    price: {
      currentPrice: {
        type: Number,
      },
      fullPrice: {
        type: Number,
      },
      discountRate: {
        type: Number,
      },
    },
    imageUrl: {
      type: String,
    },
    link: {
      type: String,
    },
    color: {
      type: String,
    },
    colorways: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
