import { model, Schema } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';
import { discountType } from '../constant/coupon.constant.js';

const CouponSchema = Schema(
  {
    limit: {
      type: Number,
      required: [true, 'limit is required'],
    },
    coupon: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, 'coupon is required'],
      set: value => value.toUpperCase(),
    },
    discount: {
      type: Number,
      required: [true, 'discount is required'],
    },
    discountCap: {
      type: Number,
      required: [true, 'discount cap is required'],
    },
    discountType: {
      type: String,
      trim: true,
      required: [true, 'discount type is required'],
      enum: {
        values: [...discountType],
        message: '{VALUE} is not matched',
      },
      set: value => value.trim().toLowerCase(),
    },
    expiresAt: {
      type: Date,
      set: value => new Date(value),
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

CouponSchema.plugin(mongoosePlugin);

const Coupon = model('Coupon', CouponSchema);

export default Coupon;
