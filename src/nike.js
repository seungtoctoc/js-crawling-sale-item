import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Product from './models/product.js';

dotenv.config();
main();

async function main() {
  await connectDB();
  await saveSaleProducts();
  disconnectDB();
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO, { dbName: 'Sales' });
    console.log('db connected');
  } catch (err) {
    console.log('error in connectDB, ', err);
  }
}

function disconnectDB() {
  try {
    mongoose.disconnect();
    console.log('db disconnected');
  } catch (err) {
    console.log('error in disconnectDB, ', err);
  }
}

async function saveSaleProducts() {
  try {
    let urlCount = 0;

    while (true) {
      const url = getUrl(urlCount++);

      const resp = await axios.get(url);
      const products = resp.data.data.products.products;

      for (const product of products) {
        let colorwayIds = [];
        if (product.colorways.length > 0) {
          colorwayIds = await saveColorways(product.colorways);
        }

        const currentPrice = product.price.currentPrice;
        const fullPrice = product.price.fullPrice;
        const discountRate = (fullPrice - currentPrice) / fullPrice;

        const price = {
          currentPrice: currentPrice,
          fullPrice: fullPrice,
          discountRate: discountRate,
        };

        const savedProduct = await Product.create({
          depth: 0,
          type: product.productType,
          title: product.title,
          subtitle: product.subtitle,
          price: price,
          imageUrl: product.images.squarishURL,
          link: getLinkUrl(product.url),
          color: product.colorDescription,
          colorways: colorwayIds,
        });
      }

      console.log('saved ' + products.length + ' items');

      if (products.length < 24 || urlCount > 0) {
        break;
      }
    }
  } catch (err) {
    console.log('error in saveSaleProducts');
    console.log(err);
    disconnectDB();
  }
}

function getLinkUrl(url) {
  return url.replace('{countryLang}', 'nike.com/kr');
}

function getUrl(times) {
  return `https://api.nike.com/cic/browse/v2?queryid=products&anonymousId=F72981C21DDC9AFA274B18AEE626CED4&country=kr&endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(KR)%26filter%3Dlanguage(ko)%26filter%3DemployeePrice(true)%26filter%3DattributeIds(5b21a62a-0503-400c-8336-3ccfbff2a684)%26anchor%3D${
    24 * times
  }%26consumerChannelId%3Dd9a5bc42-4b9c-4976-858a-f159cf99c647%26count%3D24&language=ko&localizedRangeStr=%7BlowestPrice%7D%20~%20%7BhighestPrice%7D`;
}

async function saveColorways(colorways) {
  try {
    let colorwayIds = [];

    for (const colorway of colorways) {
      const currentPrice = colorway.price.currentPrice;
      const fullPrice = colorway.price.fullPrice;
      const discountRate = (fullPrice - currentPrice) / fullPrice;

      const price = {
        currentPrice: currentPrice,
        fullPrice: fullPrice,
        discountRate: discountRate,
      };

      const savedColorway = await Product.create({
        depth: 1,
        color: colorway.colorDescription,
        price: price,
        imageUrl: colorway.images.squarishURL,
      });

      colorwayIds.push(savedColorway._id);
    }

    return colorwayIds;
  } catch (err) {
    console.log('error in saveColorways');
    console.log(err);
  }
}
