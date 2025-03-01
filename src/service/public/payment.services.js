import { stripe } from '../../app.js';
import config from '../../config/index.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import TempOrder from '../../model/tempOrder.model.js';
import createOrder from '../../utils/createOrder.js';
import createTempOrder from '../../utils/createTempOrder.js';
import updateTempOrder from '../../utils/updateTempOrder.js';

const endpointSecret = config.stripe_endpoint_secret_key;

const updatePaymentIntent = async (payload, token) => {
  let verifiedToken = token;

  if (verifiedToken)
    verifiedToken = jwtHelpers.verifiedToken(
      verifiedToken,
      config?.jwt?.refresh_secret,
    );

  const paymentIntent = await stripe.paymentIntents.retrieve(payload.id);

  const { total } = await updateTempOrder(
    payload,
    paymentIntent.metadata.orderId,
    verifiedToken?.userId,
  );

  await stripe.paymentIntents.update(payload.id, {
    amount: Number(Math.round(total * 100).toFixed(2)),
  });
};

const createPaymentIntent = async (payload, token) => {
  let verifiedToken = token;

  if (verifiedToken)
    verifiedToken = jwtHelpers.verifiedToken(
      verifiedToken,
      config?.jwt?.refresh_secret,
    );

  const { email, firstName, lastName, total, orderId } = await createTempOrder(
    payload,
    verifiedToken?.userId,
  );

  const customer = await stripe.customers.create({
    email,
    name: `${firstName} ${lastName}`,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'gbp',
    amount: Number(Math.round(total * 100).toFixed(2)),
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  return {
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  };
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
  updatePaymentIntent,
  createPaymentIntent,
  handleWebhookEvent,
};
