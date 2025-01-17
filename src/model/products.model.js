import { Schema, model } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";
import { productCategories } from "../constant/product.constant.js";

const ProductSchema = Schema(
  {
    urlParameter: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, "Url parameter is required"],
      set: (value) =>
        value
          .trim()
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, " ")
          .toLowerCase()
          .replace(/ /g, "-"),
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      required: [true, "Sku is required"],
      set: (value) =>
        value
          .trim()
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, " ")
          .toLowerCase()
          .replace(/ /g, "-"),
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
    thumbnails: [
      {
        alt: String,
        uid: String,
        path: String,
      },
    ],
    slideImages: [
      {
        alt: String,
        uid: String,
        path: String,
      },
    ],
    category: {
      type: [String],
      required: [true, "Category is required!"],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    keyword: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    type: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    format: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    flavour: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    ingredient: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    benefit: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
    },
    originName: {
      type: [String],
      set: (values) =>
        values.map((value) =>
          value
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
        ),
      default: [],
    },
    originAddress: {
      type: String,
      trim: true,
      set: (value) => value.trim().replace(/\s+/g, " ").toLowerCase(),
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

// const tea = {
//   productId: "assam-breakfast-tea",
//   title: "Assam Breakfast Tea",
//   description:
//     "Rich and well-rounded in flavor yet beautifully delicate, our Supreme Earl Grey has evenly graded, rolled wiry leaves and deep golden-amber color. It's bright and floral qualities invite you to slow down and take a breath, making it the perfect mid-morning or afternoon brew that can be enjoyed with or without milk",
//   shortDescription:
//     "Our award-winning Earl Grey Supreme combines premium Ceylon leaves with delightfully fragrant bergamot oil in this exquisite best-selling tea.",
//   thumbnails: [
//     {
//       alt: "",
//       uid: "",
//       url: "https://something1",
//     },
//   ],
//   slideImages: [
//     {
//       url: "https://something1",
//     },
//   ],
//   type: ["black-tea"],
//   format: ["loose-leaf"],
//   flavour: ["floral"],
//   ingredient: ["cacao", "cardamom", "carob", "ginger"],
//   benefit: ["energy", "gut-health", "immunity"],
//   originName: "china",
//   originAddress: "From Baotian Garden, Hunan",
//   isSale: false,
//   isSubscription: true,
//   sale: 10,
//   subscriptionSale: 10,
//   reviews: [],
//   ratings: 5,
//   unitPrices: [
//     { unit: "50gm", price: 4 },
//     { unit: "125gm", price: 8.45 },
//     { unit: "250gm", price: 15.5 },
//     { unit: "1kg", price: 42.75 },
//   ],
//   subscriptions: [
// { weeks: "2 week", days: 14 },
// { weeks: "4 week", days: 28 },
// { weeks: "6 week", days: 42 },
// { weeks: "8 week", days: 56 },
//   ],
//   howToMakeTea: [
//     {
//       title: "A hot cup",
//       requirements: ["a", "b", "c"],
//       steps: ["a", "b", "c"],
//     },
//     {
//       title: "An iced cup",
//       requirements: ["a", "b", "c"],
//       steps: ["a", "b", "c"],
//     },
//   ],
// };

// how to brew option

// ingredients drop out
// timeOfTheDay drop out
// pricing and offer pending
// add ons related 2/3 product show hobe
// header color should be change
// teaware dropdown size should be squize
// home page e new release section e "shop our tea" text ta change hobe
