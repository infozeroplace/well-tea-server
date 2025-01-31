import { Schema, model } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const ProductSchema = Schema(
  {
    urlParameter: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, "URL parameter is required"],
      set: (value) =>
        value
          .trim()
          // .replace(/[^a-zA-Z0-9\s]/g, "")
          // .replace(/\s+/g, " ")
          .toLowerCase()
          .replace(/ /g, "-"),
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, "SKU is required"],
      set: (value) =>
        value
          .trim()
          // .replace(/[^a-zA-Z0-9\s]/g, "")
          // .replace(/\s+/g, " ")
          .toLowerCase(),
      // .replace(/ /g, "-"),
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Title is required"],
    },
    longDescription: {
      type: String,
      trim: true,
      required: [true, "longDescription is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
      required: [true, "shortDescription is required"],
    },
    metaTitle: {
      type: String,
      trim: true,
      required: [true, "metaTitle is required"],
    },
    metaDescription: {
      type: String,
      trim: true,
      required: [true, "metaDescription is required"],
    },
    thumbnails: [String],
    slideImages: [String],
    category: {
      type: [String],
      required: [true, "Category is required!"],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    attribute: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    productType: {
      type: [String],
      required: [true, "Product type is required!"],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    teaFormat: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    teaFlavor: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    teaIngredient: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    teaBenefit: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    origin: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            // .replace(/[^a-zA-Z0-9\s]/g, "")
            // .replace(/\s+/g, " ")
            .toLowerCase()
        ),
      default: [],
    },
    originLocation: {
      type: String,
      trim: true,
      set: (value) =>
        value
          .trim()
          // .replace(/\s+/g, " ")
          .toLowerCase(),
    },
    youtubeLink: {
      type: String,
      trim: true,
      set: (value) =>
        value
          .trim()
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isStock: {
      type: Boolean,
      default: false,
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    isSubscription: {
      type: Boolean,
      default: false,
    },
    isMultiDiscount: {
      type: Boolean,
      default: false,
    },
    sale: {
      type: Number,
      default: 0,
    },
    subscriptionSale: {
      type: Number,
      default: 0,
    },
    multiDiscountQuantity: {
      type: Number,
      default: 0,
    },
    multiDiscountAmount: {
      type: Number,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review",
        },
      ],
      default: [],
    },
    availableAs: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
    addOns: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
    brewInstruction: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "BrewInstruction",
        },
      ],
      default: [],
    },
    unitPrices: {
      type: [{ unit: String, price: Number }],
      required: [true, "Unit price is required"],
    },
    subscriptions: {
      type: [{ weeks: String, days: Number }],
      required: [true, "Subscriptions is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

ProductSchema.plugin(mongoosePlugin);

const Product = model("Product", ProductSchema);

export default Product;
