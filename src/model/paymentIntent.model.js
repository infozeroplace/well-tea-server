import { Schema, model } from 'mongoose';

const PaymentIntentSchema = Schema(
  {
    cartId: {
      type: String,
      required: [true, 'cart id is required'],
    },
    id: {
      type: String,
      required: [true, 'id is required'],
    },
    coupon: {
      type: String,
      default: '',
    },
    shippingMethodId: {
      type: String,
      required: [true, 'method id is required'],
    },
    clientSecret: {
      type: String,
      required: [true, 'client secret is required'],
    },
    expireIn: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

PaymentIntentSchema.index({ expireIn: 1 }, { expireAfterSeconds: 0 });

const PaymentIntent = model('PaymentIntent', PaymentIntentSchema);

export default PaymentIntent;
