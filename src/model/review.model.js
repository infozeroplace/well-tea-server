import { Schema, model } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const ReviewSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    ratingPoints: {
      type: Number,
      min: [1, "Too small"],
      max: [5, "Too big"],
      required: [true, "rating point is required!"],
    },
    approved: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
      trim: true,
    },
    reviewText: {
      type: String,
      trim: true,
      required: [true, "review is required!"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

ReviewSchema.plugin(mongoosePlugin);

const Review = model("Review", ReviewSchema);

export default Review;
