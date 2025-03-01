import httpStatus from 'http-status';
import { PaymentService } from '../../service/public/payment.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const updatePaymentIntent = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { auth_refresh } = req.cookies;

  const result = await PaymentService.updatePaymentIntent(data, auth_refresh);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful',
    meta: null,
    data: result,
  });
});

const createPaymentIntent = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { auth_refresh } = req.cookies;

  const result = await PaymentService.createPaymentIntent(data, auth_refresh);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful',
    meta: null,
    data: result,
  });
});

const stripeWebhookHandler = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const data = req.rawBody;

  await PaymentService.handleWebhookEvent(data, sig);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful',
    meta: null,
    data: null,
  });
});

export const PaymentController = {
  updatePaymentIntent,
  createPaymentIntent,
  stripeWebhookHandler,
};
