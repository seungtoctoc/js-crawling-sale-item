import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
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
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

export async function saveProduct(
  brand,
  type,
  title,
  subtitle,
  currentPrice,
  fullPrice,
  imageUrl,
  link,
  color
) {
  const discountRate = (fullPrice - currentPrice) / fullPrice;

  try {
    const savedProduct = await Product.create({
      brand: brand,
      type: type,
      title: title,
      subtitle: subtitle,
      price: {
        currentPrice: currentPrice,
        fullPrice: fullPrice,
        discountRate: discountRate,
      },
      imageUrl: imageUrl,
      link: link,
      color: color,
    });

    return savedProduct;
  } catch (err) {
    throw new Error('save error');
  }
}

export const deleteProductOfBrand = async (brand) => {
  try {
    Product.deleteMany({ brand: brand });
  } catch (err) {
    throw new Error('delete error');
  }
};

export default Product;
