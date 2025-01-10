import httpStatus from "http-status";
import { SystemService } from "../../service/private/system.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const updateOfferSetting = catchAsync(async (req, res) => {
  const result = await SystemService.updateOfferSetting(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateHeroSetting = catchAsync(async (req, res) => {
  const result = await SystemService.updateHeroSetting(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const getSystemConfiguration = catchAsync(async (req, res) => {
  const result = await SystemService.getSystemConfiguration();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data retrieved successfully!",
    meta: null,
    data: result,
  });
});

export const SystemController = {
  updateOfferSetting,
  updateHeroSetting,
  getSystemConfiguration,
};
