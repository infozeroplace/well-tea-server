import httpStatus from "http-status";
import { paginationFields } from "../../constant/pagination.constant.js";
import { productFilterableField } from "../../constant/product.constant.js";
import { ProductService } from "../../service/private/product.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";

const editProduct = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await ProductService.editProduct(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Edited successfully!",
    meta: null,
    data: result,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.getProduct(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    meta: null,
    data: result,
  });
});

const getAllProductList = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProductList();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
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

const deleteProducts = catchAsync(async (req, res) => {
  const { ids } = req.body;
  const result = await ProductService.deleteProducts(ids);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully",
    meta: null,
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.body;

  const result = await ProductService.deleteProduct(id);

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
  deleteProducts,
  editProduct,
  getProduct,
  getAllProductList,
  getProductList,
  deleteProduct,
  addProduct,
};
