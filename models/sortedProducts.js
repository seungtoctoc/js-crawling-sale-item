import mongoose from 'mongoose';
import Product from './product.js';

const SortedProductsSchema = new mongoose.Schema(
  {
    sortby: {
      type: String,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const SortedProducts = mongoose.model('SortedProducts', SortedProductsSchema);

const saveSortedProducts = async (sortby, products) => {
  try {
    const savedSortedProducts = SortedProducts.create({
      sortby: sortby,
      products: products,
    });

    return savedSortedProducts;
  } catch (err) {
    throw new Error('error in save sorted products.\n' + err);
  }
};

export const updateSortedProducts = async () => {
  try {
    await deleteSortedProducts();
    console.log('deleted sorted products');

    // default : 다른 브랜드도 섞어줘야 함.
    const defaultIds = await Product.find({}).select('_id').lean();
    await saveSortedProducts('default', defaultIds);
    console.log('saved default sorted products');

    // low price
    const lowPriceIds = await Product.find({})
      .sort({ 'price.currentPrice': 1 })
      .select('_id');
    await saveSortedProducts('lowPrice', lowPriceIds);
    console.log('saved low price sorted products');

    // high price
    const highPriceIds = await Product.find({})
      .sort({ 'price.currentPrice': -1 })
      .select('_id');
    await saveSortedProducts('highPrice', highPriceIds);
    console.log('saved high price sorted products');

    // high discount rate
    const highDiscountRateIds = await Product.find({})
      .sort({ 'price.discountRate': -1 })
      .select('_id');
    await saveSortedProducts('highDiscountRate', highDiscountRateIds);
    console.log('saved high discount rate sorted products');
  } catch (err) {
    throw new Error('error in update sorted products.\n' + err);
  }
};

export const deleteSortedProducts = async () => {
  try {
    await SortedProducts.deleteMany({});
  } catch (err) {
    throw new Error('error in deleting sorted products.\n' + err);
  }
};

export default SortedProducts;
