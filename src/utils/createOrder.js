import { stripe } from '../app.js';
import Cart from '../model/cart.model.js';
import { Invoice } from '../model/invoice.model.js';
import Order from '../model/order.model.js';
import TempOrder from '../model/tempOrder.model.js';
import generateInvoiceId from './generateInvoiceId.js';

const createOrder = async (orderId, paymentIntentId) => {
  const existingOrder = await TempOrder.findOne({ orderId }).lean();

  const name = `${existingOrder.shippingAddress.firstName} ${
    existingOrder.shippingAddress.lastName
  }`;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  const invoiceId = await generateInvoiceId();

  const newInvoice = {
    invoiceId,
    transactionId: paymentIntentId,
    orderId,
    name,
    email: existingOrder.email,
    phone: existingOrder.shippingAddress.phone,
    subtotal: existingOrder.subtotal,
    shipping: existingOrder.shipping,
    total: existingOrder.total,
    items: existingOrder.items,
  };

  const createdInvoice = await Invoice.create(newInvoice);

  const newOrder = {
    ...existingOrder,
    invoice: createdInvoice._id,
    paymentStatus: 'paid',
    transactionId: paymentIntentId,
    items: existingOrder.items,
  };

  const createdOrder = await Order.create(newOrder);

  await Cart.findOneAndUpdate(
    { _id: existingOrder.cart },
    { $set: { items: [] } },
  );

  await TempOrder.deleteOne({ orderId });
};

export default createOrder;
