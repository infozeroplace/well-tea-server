import httpStatus from "http-status";
import { SystemService } from "../../service/public/system.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const getSystemConfig = catchAsync(async (req, res) => {
  const result = await SystemService.getSystemConfig();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Data retrieved successfully",
    meta: null,
    data: result,
  });
});

export const SystemController = {
  getSystemConfig,
};
