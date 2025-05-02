import { stripe } from '../../app.js';
import config from '../../config/index.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import {
  handleOneTimePayment,
  handleSubscriptionPayment,
} from '../../helper/paymentHandlers.js';
import PaymentIntent from '../../model/paymentIntent.model.js';
import TempOrder from '../../model/tempOrder.model.js';
import createOrder from '../../utils/createOrder.js';
import createTempOrder from '../../utils/createTempOrder.js';
import updateTempOrder from '../../utils/updateTempOrder.js';

const endpointSecret = config.stripe_endpoint_secret_key;

const createPaymentIntentTest = async () => {
  const customer = await stripe.customers.create({
    email: 'rumanislam0429@gmail.com',
    name: 'Ruman Islam',
  });

  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'gbp',
    amount: 21.99 * 100,
    customer: customer.id,
    // payment_method_types: ['paypal']
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent.client_secret;
};

const getPaymentIntent = async cartId => {
  const result = await PaymentIntent.findOne({ cartId });

  return result;
};

const updatePaymentIntent = async (payload, token, res) => {
  console.log('update');
  let verifiedToken = token;

  if (verifiedToken) {
    verifiedToken = jwtHelpers.verifiedToken(
      verifiedToken,
      config?.jwt?.refresh_secret,
    );
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(payload.id);

  const { total } = await updateTempOrder(
    payload,
    paymentIntent.metadata.orderId,
    verifiedToken?.userId,
    paymentIntent.id,
    paymentIntent.client_secret,
  );

  await stripe.paymentIntents.update(payload.id, {
    amount: Number(Math.round(total * 100).toFixed(2)),
  });
};

const createPaymentIntent = async (payload, token) => {
  console.log('create');
  let verifiedToken = token;

  if (verifiedToken) {
    verifiedToken = jwtHelpers.verifiedToken(
      verifiedToken,
      config?.jwt?.refresh_secret,
    );
  }

  const {
    email,
    firstName,
    lastName,
    total,
    orderId,
    shippingMethodId,
    isItemsExists,
    subscriptionItems,
    onetimeItems,
  } = await createTempOrder(payload, verifiedToken?.userId);

  if (!isItemsExists) {
    return;
  }

  const customer = await stripe.customers.create({
    email,
    name: `${firstName} ${lastName}`,
  });

  // Handle both one-time payment and subscription
  if (subscriptionItems.length > 0 && onetimeItems.length > 0) {
    console.log('both');
  } else if (subscriptionItems.length > 0) {
    console.log('Subscription');
    // Subscription only
    return await handleSubscriptionPayment(
      customer,
      subscriptionItems,
      orderId,
      shippingMethodId,
      payload.cartId,
    );
  } else {
    console.log('one time');
    // One-time payment only (existing flow)
    return await handleOneTimePayment(
      customer,
      total,
      orderId,
      shippingMethodId,
      payload.cartId,
    );
  }
};

const handleWebhookEvent = async (data, sig) => {
  const event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
  const session = event?.data?.object;
  const { metadata, id } = session;

  const { orderId } = metadata;

  if (event.type === 'payment_intent.succeeded') {
    await createOrder(orderId, id);

    return;
  } else if (event.type === 'payment_intent.payment_failed') {
    await TempOrder.deleteOne({ orderId });

    return;
  } else if (event.type === 'payment_intent.canceled') {
    await TempOrder.deleteOne({ orderId });

    return;
  }
};

export const PaymentService = {
  createPaymentIntentTest,
  getPaymentIntent,
  updatePaymentIntent,
  createPaymentIntent,
  handleWebhookEvent,
};
