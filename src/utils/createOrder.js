import { stripe } from '../app.js';
import config from '../config/index.js';
import Cart from '../model/cart.model.js';
import Coupon from '../model/coupon.model.js';
import { Invoice } from '../model/invoice.model.js';
import Order from '../model/order.model.js';
import TempOrder from '../model/tempOrder.model.js';
import User from '../model/user.model.js';
import {
  sendOrderDetailsToAdmin,
  sendOrderInvoiceToCustomer,
} from '../shared/nodeMailer.js';
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
    coupon: existingOrder.coupon,
    name,
    email: existingOrder.email,
    phone: existingOrder.shippingAddress.phone,
    subtotal: existingOrder.subtotal,
    shipping: existingOrder.shipping,
    total: existingOrder.total,
    discount: existingOrder.discount,
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

  await Order.create(newOrder);

  await Cart.findOneAndUpdate(
    { _id: existingOrder.cart },
    { $set: { items: [] } },
  );

  if (existingOrder.coupon) {
    await Coupon.findOneAndUpdate(
      { coupon: existingOrder.coupon },
      { $inc: { limit: -1 } },
    );
  }

  if (existingOrder.user) {
    await User.findByIdAndUpdate(existingOrder.user, {
      $inc: { rewardPoints: 1 },
    });
  }

  await TempOrder.deleteOne({ orderId });

  const superAdmin = await User.findOne({ role: config.super_admin_role });

  await sendOrderDetailsToAdmin(createdInvoice.toObject(), superAdmin.email);
  await sendOrderInvoiceToCustomer(createdInvoice.toObject());
};

export default createOrder;
