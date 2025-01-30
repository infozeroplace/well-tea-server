import httpStatus from "http-status";
import { SystemService } from "../../service/private/system.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const updateFAQ = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await SystemService.updateFAQ(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateDeliveryPolicy = catchAsync(async (req, res) => {
  const { content } = req.body;

  const result = await SystemService.updateDeliveryPolicy(content);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateSubscriptionPolicy = catchAsync(async (req, res) => {
  const { content } = req.body;

  const result = await SystemService.updateSubscriptionPolicy(content);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateReturnAndRefundPolicy = catchAsync(async (req, res) => {
  const { content } = req.body;

  const result = await SystemService.updateReturnAndRefundPolicy(content);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateCookiesPolicy = catchAsync(async (req, res) => {
  const { content } = req.body;

  const result = await SystemService.updateCookiesPolicy(content);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateTermsAndConditions = catchAsync(async (req, res) => {
  const { content } = req.body;

  const result = await SystemService.updateTermsAndConditions(content);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updatePrivacyPolicy = catchAsync(async (req, res) => {
  const { content } = req.body;

  const result = await SystemService.updatePrivacyPolicy(content);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateCompanyService = catchAsync(async (req, res) => {
  const result = await SystemService.updateCompanyService(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateWhyChooseUs = catchAsync(async (req, res) => {
  const result = await SystemService.updateWhyChooseUs(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

const updateSecondaryLogo = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await SystemService.updateSecondaryLogo(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully!",
    meta: null,
    data: result,
  });
});

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
  updateFAQ,
  updateDeliveryPolicy,
  updateSubscriptionPolicy,
  updateReturnAndRefundPolicy,
  updateCookiesPolicy,
  updateTermsAndConditions,
  updatePrivacyPolicy,
  updateCompanyService,
  updateWhyChooseUs,
  updateSecondaryLogo,
  updateNotification,
  updateFeaturedSectionSetting,
  updateOfferSetting,
  updateLogo,
  updateHeroSetting,
  getSystemConfiguration,
};
