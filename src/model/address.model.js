import { model, Schema } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";
import { countries } from "../constant/address.constant.js";

const AddressSchema = Schema(
  {
    userId: {
      type: String,
      trim: true,
      required: [true, "user id is required"],
    },
    firstName: {
      type: String,
      trim: true,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "last name is required"],
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    address1: {
      type: String,
      trim: true,
      required: [true, "address 1 is required"],
    },
    address2: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      trim: true,
      required: [true, "country is required"],
      enum: {
        values: [...countries],
        message: "{VALUE} is not matched",
      },
    },
    postalCode: {
      type: String,
      trim: true,
      required: [true, "postal code is required"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "phone is required"],
      set: (value) => value.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, " "),
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

AddressSchema.plugin(mongoosePlugin);

const Address = model("Address", AddressSchema);

export default Address;
