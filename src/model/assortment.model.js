import { model, Schema } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";
import { assortments } from "../constant/assortment.constant.js";

const AssortmentSchema = Schema(
  {
    assortment: {
      type: String,
      trim: true,
      required: [true, "Assortment is required"],
      set: (value) =>
        value
          .trim()
          .replace(/[^a-zA-Z0-9\s&]/g, "") // Remove invalid characters except for alphanumerics, spaces, and &
          .replace(/\s+/g, " ") // Replace multiple spaces with a single space
          .toLowerCase(),
    },
    assortmentType: {
      type: String,
      trim: true,
      required: [true, "Assortment type is required"],
      enum: {
        values: [...assortments],
        message: "{VALUE} is not matched",
      },
      set: (value) => value.trim().toLowerCase(),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

AssortmentSchema.plugin(mongoosePlugin);

const Assortment = model("Assortment", AssortmentSchema);

export default Assortment;
