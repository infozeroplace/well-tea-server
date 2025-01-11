import httpStatus from "http-status";
import { paginationFields } from "../../constant/pagination.constant.js";
import { productTeaFilterableField } from "../../constant/product.constant.js";
import { ProductService } from "../../service/private/product.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";
import pick from "../../shared/pick.js";

const getProductList = catchAsync(async (req, res) => {
  const filters = pick(req.query, productTeaFilterableField);
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

const deleteProduct = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await ProductService.deleteProduct(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully!",
    meta: null,
    data: result,
  });
});

const addProduct = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await ProductService.addProduct(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const ProductController = {
  getProductList,
  deleteProduct,
  addProduct,
};
