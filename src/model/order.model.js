import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';
import { address } from '../constant/address.constant.js';
import {
  customerType,
  deliverStatus,
  paymentStatus,
} from '../constant/order.constant.js';

const OrderSchema = Schema(
  {
    email: {
      type: String,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'invalid email format',
      ],
      required: [true, 'email is required'],
    },
    orderId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, 'order id is required'],
    },
    transactionId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, 'transaction id is required'],
    },
    invoice: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: [true, 'invoice id is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
      required: [true, 'cart id is required'],
    },
    shippingMethod: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
      required: [true, 'shipping method id is required'],
    },
    shippingAddress: {
      type: address,
      required: [true, 'shipping address is required'],
    },
    billingAddress: {
      type: address,
      required: [true, 'billing address is required'],
    },
    deliveryStatus: {
      type: String,
      enum: {
        values: deliverStatus,
        message: '{VALUE} is not matched',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: paymentStatus,
        message: '{VALUE} is not matched',
      },
      required: [true, 'payment status is required'],
    },
    customerNotes: {
      type: String,
      trim: true,
      default: '',
    },
    coupon: {
      type: String,
      trim: true,
      default: '',
    },
    customerType: {
      type: String,
      enum: {
        values: customerType,
        message: '{VALUE} is not matched',
      },
      required: [true, 'customer type is required'],
    },
    subtotal: {
      type: Number,
      required: [true, 'subtotal is required'],
    },
    shipping: {
      type: Number,
      required: [true, 'shipping is required'],
    },
    total: {
      type: Number,
      required: [true, 'total is required'],
    },
    items: {
      type: [],
      required: [true, 'items are required'],
    },
  },
  { timestamps: true },
);

OrderSchema.plugin(mongoosePlugin);

const Order = model('Order', OrderSchema);

export default Order;
