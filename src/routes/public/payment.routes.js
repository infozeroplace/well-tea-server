import express from 'express';
import { PaymentController } from '../../controller/public/payment.controller.js';
// import validateRequest from '../../middleware/validateRequest.js';
// import { PaymentValidation } from '../../validation/payment.validation.js';

const router = express.Router();

router.post(
  '/payment/create-payment-intent',
  //   validateRequest(PaymentValidation.createPaymentIntentZod),
  PaymentController.createPaymentIntent,
);

router.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhookHandler,
);

export const PaymentRoutes = router;
