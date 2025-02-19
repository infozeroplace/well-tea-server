import httpStatus from 'http-status';
import { NewsletterService } from '../../service/public/newsletter.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const subscribe = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  await NewsletterService.subscribe(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'subscribed successfully',
    meta: null,
    data: null,
  });
});

export const NewsletterController = {
  subscribe,
};
