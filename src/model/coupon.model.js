import { model, Schema } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const CouponSchema = Schema(
  {
    coupon: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, 'coupon is required'],
      set: value => value.toUpperCase(),
    },
    eligibleUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    usedUsers: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    discount: {
      type: Number,
      required: [true, 'discount is required'],
    },
    expiresAt: {
      type: Date,
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
