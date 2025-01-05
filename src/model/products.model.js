import { Schema, model } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const TeaSchema = Schema(
  {
    productId: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Product ID is required"],
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
      unique: true,
      trim: true,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      trim: true,
      required: [true, "Short description is required"],
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
      type: String,
      trim: true,
      set: (value) => value.trim().replace(/\s+/g, " ").toLowerCase(),
    },
    originAddress: {
      type: String,
      trim: true,
      set: (value) => value.trim().replace(/\s+/g, " ").toLowerCase(),
    },
    isSale: {
      type: Boolean,
      default: true,
    },
    isSubscription: {
      type: Boolean,
      default: false,
    },
    sale: {
      type: Number,
      default: false,
    },
    subscriptionSale: {
      type: Number,
      default: false,
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
    howToMakeTea: {
      type: [
        {
          title: String,
          requirements: [String],
          steps: [String],
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

TeaSchema.plugin(mongoosePlugin);

const Tea = model("Tea", TeaSchema);

export { Tea };

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
//     { weeks: "2 week", days: 14 },
//     { weeks: "4 week", days: 28 },
//     { weeks: "6 week", days: 42 },
//     { weeks: "8 week", days: 56 },
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
