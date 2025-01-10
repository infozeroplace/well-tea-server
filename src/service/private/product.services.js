import httpStatus from "http-status";
import ApiError from "../../error/ApiError.js";
import Product from "../../model/products.model.js";
import extractAlterText from "../../utils/extractAlterText.js";
import { removeImage } from "../../utils/fileSystem.js";

const deleteProduct = async (payload) => {
  const isExistProduct = await Product.findById(payload.id);

  if (!isExistProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
  }

  const imagesToRemove = [
    ...(isExistProduct?.thumbnails || []),
    ...(isExistProduct?.slideImages || []),
  ];

  const result = await Product.findByIdAndDelete(payload.id);

  if (imagesToRemove.length > 0) {
    await Promise.all(
      imagesToRemove.map((element) => removeImage(element.uid))
    );
  }
  return result;
};

const addProduct = async (payload) => {
  const { thumbnails, slideImages, ...data } = payload;

  const product = {
    thumbnails: thumbnails.map((item) => ({
      alt: extractAlterText(item),
      uid: item,
      path: `/public/image/upload/${item}`,
    })),
    slideImages: slideImages.map((item) => ({
      alt: extractAlterText(item),
      uid: item,
      path: `/public/image/upload/${item}`,
    })),
    ...data,
  };

  const result = await Product.create(product);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  return result;
};

export const ProductService = {
  deleteProduct,
  addProduct,
};
