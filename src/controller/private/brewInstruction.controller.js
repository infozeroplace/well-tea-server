import httpStatus from "http-status";
import { brewInstructionFilterableField } from "../../constant/BrewInstruction.constant.js";
import { paginationFields } from "../../constant/pagination.constant.js";
import { BrewInstructionService } from "../../service/private/brewInstruction.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";

const deleteBrewInstructions = catchAsync(async (req, res) => {
  const result = await BrewInstructionService.deleteBrewInstructions(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Instructions deleted successfully",
    meta: null,
    data: result,
  });
});

const getAllBrewInstructionList = catchAsync(async (req, res) => {
  const result = await BrewInstructionService.getAllBrewInstructionList();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assortments retrieved successfully",
    meta: null,
    data: result,
  });
});

const deleteBrewInstruction = catchAsync(async (req, res) => {
  const result = await BrewInstructionService.deleteBrewInstruction(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete successfully!",
    meta: null,
    data: result,
  });
});

const getBrewInstructionList = catchAsync(async (req, res) => {
  const filters = pick(req.query, brewInstructionFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await BrewInstructionService.getBrewInstructionList(
    filters,
    paginationOptions
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Instructions retrieved successfully",
    meta,
    data,
  });
});

const addInstruction = catchAsync(async (req, res) => {
  const result = await BrewInstructionService.addInstruction(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const BrewInstructionController = {
  deleteBrewInstructions,
  getAllBrewInstructionList,
  deleteBrewInstruction,
  getBrewInstructionList,
  addInstruction,
};
