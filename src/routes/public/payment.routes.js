import express from 'express';
import { PaymentController } from '../../controller/public/payment.controller.js';

const router = express.Router();

router.get(
  '/payment/get-payment-intent',
  PaymentController.getPaymentIntent,
);

router.post(
  '/payment/update-payment-intent',
  PaymentController.updatePaymentIntent,
);

router.post(
  '/payment/create-payment-intent',
  PaymentController.createPaymentIntent,
);

router.post(
  '/payment/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhookHandler,
);

export const PaymentRoutes = router;
