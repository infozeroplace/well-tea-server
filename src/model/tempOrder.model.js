import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';
import { address } from '../constant/address.constant.js';
import { customerType } from '../constant/order.constant.js';

const TempOrderSchema = Schema(
  {
    email: {
      type: String,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'invalid email format',
      ],
    },
    orderId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, 'order id is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
    },
    billingAddress: {
      type: address,
    },
    customerNotes: {
      type: String,
      trim: true,
      default: '',
    },
    customerType: {
      type: String,
      trim: true,
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
    items: [],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

TempOrderSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

TempOrderSchema.plugin(mongoosePlugin);

const TempOrder = model('TempOrder', TempOrderSchema);

export default TempOrder;
