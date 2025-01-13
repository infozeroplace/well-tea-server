import httpStatus from "http-status";
import { categoryFilterableField } from "../../constant/category.constant.js";
import { paginationFields } from "../../constant/pagination.constant.js";
import { CategoryService } from "../../service/private/category.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";

const deleteCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategory(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete successfully!",
    meta: null,
    data: result,
  });
});

const getCategoryList = catchAsync(async (req, res) => {
  const filters = pick(req.query, categoryFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await CategoryService.getCategoryList(
    filters,
    paginationOptions
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories retrieved successfully",
    meta,
    data,
  });
});

const addCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.addCategory(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const CategoryController = {
  deleteCategory,
  getCategoryList,
  addCategory,
};
