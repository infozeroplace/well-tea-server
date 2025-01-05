import httpStatus from "http-status";
import ApiError from "../../error/ApiError.js";
import { Tea } from "../../model/products.model.js";
import extractAlterText from "../../utils/extractAlterText.js";
import { removeImage } from "../../utils/fileSystem.js";

const deleteProductTea = async (payload) => {
  const isExistProduct = await Tea.findById(payload.id);

  if (!isExistProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
  }

  const imagesToRemove = [
    ...(isExistProduct?.thumbnails || []),
    ...(isExistProduct?.slideImages || []),
  ];

  const result = await Tea.findByIdAndDelete(payload.id);

  if (imagesToRemove.length > 0) {
    await Promise.all(
      imagesToRemove.map((element) => removeImage(element.uid))
    );
  }
  return result;
};

const addProductTea = async (payload) => {
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

  const result = await Tea.create(product);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  return result;
};

export const ProductService = {
  deleteProductTea,
  addProductTea,
};
