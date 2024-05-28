import axios from 'axios';

import { connectDB, disconnectDB } from '../utils/database.js';
import { saveProduct, deleteProductOfBrand } from '../models/product.js';
import {
  deleteSortedProducts,
  updateSortedProducts,
} from '../models/sortedProducts.js';

const main = async () => {
  try {
    await connectDB();

    await deleteProductOfBrand('NIKE');
    await saveSaleProducts();

    await deleteSortedProducts();
    await updateSortedProducts();

    disconnectDB();
  } catch (err) {
    console.log(err);
  }
};

const saveSaleProducts = async () => {
  try {
    let urlCount = 0;
    let savedCount = 0;

    while (true) {
      const url = getUrl(urlCount++);
      const resp = await axios.get(url);
      const products = resp.data.data.products.products;

      for (const product of products) {
        await saveProduct(
          'NIKE',
          product.productType,
          product.title,
          product.subtitle,
          product.price.currentPrice,
          product.price.fullPrice,
          product.images.squarishURL,
          getLinkUrl(product.url),
          product.colorDescription
        );
        savedCount++;

        if (product.colorways.length > 0) {
          const colorways = product.colorways;

          for (const colorway of colorways) {
            if (colorway.colorDescription === product.colorDescription) {
              continue;
            }

            await saveProduct(
              'NIKE',
              product.productType,
              product.title,
              product.subtitle,
              colorway.price.currentPrice,
              colorway.price.fullPrice,
              colorway.images.squarishURL,
              getLinkUrl(product.url),
              colorway.colorDescription
            );
            savedCount++;
          }
        }
      }

      console.log('saved ' + savedCount + ' items');

      if (products.length < 24) {
        break;
      }
    }
  } catch (err) {
    console.log('error in saveSaleProducts');
    console.log(err);
    disconnectDB();
  }
};

const getLinkUrl = (url) => {
  return url.replace('{countryLang}', 'nike.com/kr');
};

const getUrl = (times) => {
  return `https://api.nike.com/cic/browse/v2?queryid=products&anonymousId=F72981C21DDC9AFA274B18AEE626CED4&country=kr&endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(KR)%26filter%3Dlanguage(ko)%26filter%3DemployeePrice(true)%26filter%3DattributeIds(5b21a62a-0503-400c-8336-3ccfbff2a684)%26anchor%3D${
    24 * times
  }%26consumerChannelId%3Dd9a5bc42-4b9c-4976-858a-f159cf99c647%26count%3D24&language=ko&localizedRangeStr=%7BlowestPrice%7D%20~%20%7BhighestPrice%7D`;
};

main();
