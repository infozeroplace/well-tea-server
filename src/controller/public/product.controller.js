import httpStatus from "http-status";
import { paginationFields } from "../../constant/pagination.constant.js";
import { productFilterableField } from "../../constant/product.constant.js";
import { ProductService } from "../../service/public/product.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";

const getRelatedProductList = catchAsync(async (req, res) => {
  const { ids } = req.body;

  const result = await ProductService.getRelatedProductList(ids);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    meta: null,
    data: result,
  });
});

const getProductList = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await ProductService.getProductList(
    filters,
    paginationOptions
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    meta,
    data,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const result = await ProductService.getProduct(slug);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    meta: null,
    data: result,
  });
});

export const ProductController = {
  getRelatedProductList,
  getProduct,
  getProductList,
};
