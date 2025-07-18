import { stripe } from '../app.js';
import ShippingMethod from '../model/shippingMethod.js';

// Helper function for subscription-only payment
export const handleSubscriptionPayment = async (
  customer,
  subscriptionItems,
  orderId,
  shippingMethodId,
  cartId,
) => {
  const shippingMethod = await ShippingMethod.findOne({
    'methods._id': shippingMethodId,
  });

  const method = shippingMethod.methods.find(
    m => m._id.toString() === shippingMethodId,
  );

  const methodCost = Number(method?.cost.toFixed(2)) || 0;
  const shippingCostInPence = Math.round(methodCost * 100);

  // Similar to handleCombinedPayment but without one-time items
  const subscriptionPrices = await Promise.all(
    subscriptionItems.map(async item => {
      return await stripe.prices.create({
        currency: 'gbp',
        unit_amount: Number(Math.round(item.totalPrice * 100).toFixed(2)),
        recurring: {
          interval: item.subscription.toLowerCase().includes('week')
            ? 'week'
            : item.subscription.toLowerCase().includes('month')
              ? 'month'
              : 'year',
          interval_count: parseInt(item.subscription) || 1,
        },
        product_data: {
          name: item.title,
        },
      });
    }),
  );

  const shippingProduct = await stripe.products.create({
    name: 'Shipping Fee',
    description: 'Delivery charges for your order',
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: subscriptionPrices.map(price => ({ price: price.id })),
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
    metadata: { orderId },
    add_invoice_items: [
      {
        price_data: {
          currency: 'gbp',
          product: shippingProduct.id, // Use the created product ID
          unit_amount: shippingCostInPence,
        }, 
      },
    ],
  });

  return subscription.latest_invoice.payment_intent.client_secret;
};

export const handleOneTimePayment = async (
  customer,
  total,
  orderId,
  shippingMethodId,
  cartId,
) => {
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

  return paymentIntent.client_secret;
};
