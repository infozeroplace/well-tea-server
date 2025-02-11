import { model, Schema } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const WishlistSchema = Schema(
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

WishlistSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { userId: null } },
);
WishlistSchema.plugin(mongoosePlugin);

const Wishlist = model('Wishlist', WishlistSchema);

export default Wishlist;
