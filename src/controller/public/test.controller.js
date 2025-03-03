import httpStatus from 'http-status';
import { TestService } from '../../service/public/test.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const test = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { auth_refresh } = req.cookies;

  const result = await TestService.test(data, auth_refresh);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful',
    meta: null,
    data: result,
  });
});

export const TestController = {
  test,
};
