import axios from 'axios';
import * as cheerio from 'cheerio';

import { saveProduct } from '../models/product.js';

export const saveAdidasSale = async () => {
  try {
    let urlCount = 0;
    let savedCount = 0;

    while (true) {
      const url = getUrl(urlCount++);
      console.log('url: ', url);

      const axiosInstance = axios.create({
        timeout: 10000,
        headers: {
          'User-Agent': 'PostmanRuntime/7.39.0',
        },
      });

      const resp = await axiosInstance.get(url);

      const $ = cheerio.load(resp.data);

      const title = $('title').text();
      console.log(title);

      break;
    }
  } catch (err) {
    throw new Error('error in saveAdidasSale.\n' + err);
  }
};

const getUrl = (urlCount) => {
  const url = 'https://www.adidas.co.kr/outlet';
  if (urlCount === 0) {
    return url;
  }
  return `${url}?start=${48 * urlCount}`;
};
