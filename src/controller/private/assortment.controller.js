import httpStatus from "http-status";
import { assortmentFilterableField } from "../../constant/assortment.constant.js";
import { paginationFields } from "../../constant/pagination.constant.js";
import { AssortmentService } from "../../service/private/assortment.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";

const deleteAssortments = catchAsync(async (req, res) => {
  const result = await AssortmentService.deleteAssortments(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assortments deleted successfully",
    meta: null,
    data: result,
  });
});

const getAllAssortmentList = catchAsync(async (req, res) => {
  const result = await AssortmentService.getAllAssortmentList();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assortments retrieved successfully",
    meta: null,
    data: result,
  });
});

const deleteAssortment = catchAsync(async (req, res) => {
  const result = await AssortmentService.deleteAssortment(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete successfully!",
    meta: null,
    data: result,
  });
});

const getAssortmentList = catchAsync(async (req, res) => {
  const filters = pick(req.query, assortmentFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await AssortmentService.getAssortmentList(
    filters,
    paginationOptions
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assortments retrieved successfully",
    meta,
    data,
  });
});

const addAssortment = catchAsync(async (req, res) => {
  const result = await AssortmentService.addAssortment(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const AssortmentController = {
  deleteAssortments,
  getAllAssortmentList,
  deleteAssortment,
  getAssortmentList,
  addAssortment,
};
