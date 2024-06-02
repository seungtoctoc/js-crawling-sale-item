import { connectDB, disconnectDB } from '../utils/database.js';
import { deleteProductOfBrand } from '../models/product.js';
import { saveNikeSale } from './nike.js';
import { saveAdidasSale } from './adidas.js';
import {
  deleteSortedProducts,
  updateSortedProducts,
} from '../models/sortedProducts.js';

const main = async () => {
  try {
    // await connectDB();

    // await deleteProductOfBrand('NIKE');
    // await saveNikeSale();

    await saveAdidasSale();

    // await deleteSortedProducts();
    // await updateSortedProducts();

    // disconnectDB();
  } catch (err) {
    // disconnectDB();
    console.log(err);
  }
};

main();
