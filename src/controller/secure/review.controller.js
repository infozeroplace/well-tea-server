import httpStatus from "http-status";
import { ReviewService } from "../../service/secure/review.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const addReview = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { userId } = req.user;

  const result = await ReviewService.addReview(data, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const ReviewController = {
  addReview,
};
