import httpStatus from "http-status";
import { SystemService } from "../../service/private/system.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const updateNotification = catchAsync(async (req, res) => {
  const result = await SystemService.updateNotification(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateFeaturedSectionSetting = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await SystemService.updateFeaturedSectionSetting(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateLogo = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await SystemService.updateLogo(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

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
  updateNotification,
  updateFeaturedSectionSetting,
  updateOfferSetting,
  updateLogo,
  updateHeroSetting,
  getSystemConfiguration,
};
