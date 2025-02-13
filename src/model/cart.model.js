import { model, Schema } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const CartSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestId: { type: String, default: null },
    items: {
      type: [
        {
          productId: { type: Schema.Types.ObjectId, ref: 'Product' },
          purchaseType: { type: String, required: true },
          quantity: { type: Number, default: 1 },
          unitPriceId: { type: String, required: true },
          subscriptionId: { type: String, default: "" },
          addedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
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

CartSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { userId: null } },
);

CartSchema.plugin(mongoosePlugin);

const Cart = model('Cart', CartSchema);

export default Cart;
