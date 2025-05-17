import { stripe } from '../../app.js';
import config from '../../config/index.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import {
  handleOneTimePayment,
  handleSubscriptionPayment,
} from '../../helper/paymentHandlers.js';
import TempOrder from '../../model/tempOrder.model.js';
import createOrder from '../../utils/createOrder.js';
import createTempOrder from '../../utils/createTempOrder.js';

const endpointSecret = config.stripe_endpoint_secret_key;

const createPaymentIntent = async (payload, token) => {
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
    // console.log('both');
    return;
  } else if (subscriptionItems.length > 0) {
    // console.log('Subscription');
    // Subscription only
    // return await handleSubscriptionPayment(
    //   customer,
    //   subscriptionItems,
    //   orderId,
    //   shippingMethodId,
    //   payload.cartId,
    // );

    return;
  } else {
    // console.log('one time');
    // One-time payment only (existing flow)
    return await handleOneTimePayment(
      customer,
      total,
      orderId,
      shippingMethodId,
      payload.cartId,
    );
  }

  // const product = await stripe.products.create({
  //   name: 'Demo',
  // });

  // const plan = await stripe.plans.create({
  //   currency: 'gbp',
  //   interval: 'week',
  //   interval_count: 2,
  //   nickname: 'Demo',
  //   product:  product.id,
  //   amount: 500,
  //   usage_type: 'licensed'
  // });

  // console.log(plan)
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
  createPaymentIntent,
  handleWebhookEvent,
};
