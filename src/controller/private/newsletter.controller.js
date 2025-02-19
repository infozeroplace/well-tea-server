import httpStatus from 'http-status';
import { newsletterFilterableField } from '../../constant/newsletter.constant.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { NewsletterService } from '../../service/private/newsletter.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const sendBulkEmail = catchAsync(async (req, res) => {
  const { emails } = req.body;

  const result = await NewsletterService.sendBulkEmail(emails);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'email has been sent',
    meta: null,
    data: null,
  });
});

const getSubscribedUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, newsletterFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await NewsletterService.getSubscribedUsers(
    filters,
    paginationOptions,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta,
    data,
  });
});

export const NewsletterController = {
  sendBulkEmail,
  getSubscribedUsers,
};
