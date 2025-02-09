import { model, Schema } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const CartSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    guestCartId: { type: String, default: null },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
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
  }
);

CartSchema.plugin(mongoosePlugin);

const Cart = model("Cart", CartSchema);

export default Cart;
