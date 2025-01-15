import { model, Schema } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const AssortmentSchema = Schema(
  {
    assortment: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, "Value is required"],
      set: (value) =>
        value
          .trim()
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, " ")
          .toLowerCase(),
    },
    assortmentType: {
      type: String,
      trim: true,
      set: (value) =>
        value
          .trim()
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, " ")
          .toLowerCase(),
      default: "",
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
