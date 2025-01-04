import { Schema } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";

const TeaSchema = Schema(
  {
    productId: {
      type: String,
      unique: true,
      required: [true, "Product ID is required"],
    },
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },
    thumbnails: [
      {
        alt: String,
        uid: String,
        url: {
          type: String,
          match: [/(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format"],
        },
      },
    ],
    slideImages: [
      {
        alt: String,
        uid: String,
        url: {
          type: String,
          match: [/(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format"],
        },
      },
    ],
    type: [String],
    format: [String],
    flavour: [String],
    ingredient: [String],
    benefit: [String],
    originName: String,
    originAddress: String,
    isSale: Boolean,
    isSubscription: Boolean,
    sale: Number,
    subscriptionSale: Number,
    ratings: Number,
    reviews: Array,
    unitPrices: [{ unit: String, price: Number }],
    subscriptions: [{ weeks: String, days: Number }],
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

const tea = {
  productId: "assam-breakfast-tea",
  title: "Assam Breakfast Tea",
  description:
    "Rich and well-rounded in flavor yet beautifully delicate, our Supreme Earl Grey has evenly graded, rolled wiry leaves and deep golden-amber color. It's bright and floral qualities invite you to slow down and take a breath, making it the perfect mid-morning or afternoon brew that can be enjoyed with or without milk",
  shortDescription:
    "Our award-winning Earl Grey Supreme combines premium Ceylon leaves with delightfully fragrant bergamot oil in this exquisite best-selling tea.",
  thumbnails: [
    {
      alt: "",
      uid: "",
      url: "https://something1",
    },
  ],
  slideImages: [
    {
      url: "https://something1",
    },
  ],
  type: ["black-tea"],
  format: ["loose-leaf"],
  flavour: ["floral"],
  ingredient: ["cacao", "cardamom", "carob", "ginger"],
  benefit: ["energy", "gut-health", "immunity"],
  originName: "china",
  originAddress: "From Baotian Garden, Hunan",
  isSale: false,
  isSubscription: true,
  sale: 10,
  subscriptionSale: 10,
  reviews: [],
  ratings: 5,
  unitPrices: [
    { unit: "50gm", price: 4 },
    { unit: "125gm", price: 8.45 },
    { unit: "250gm", price: 15.5 },
    { unit: "1kg", price: 42.75 },
  ],
  subscriptions: [
    { weeks: "2 week", days: 14 },
    { weeks: "4 week", days: 28 },
    { weeks: "6 week", days: 42 },
    { weeks: "8 week", days: 56 },
  ],
};

// how to brew option

// ingredients drop out
// timeOfTheDay drop out
// pricing and offer pending
// add ons related 2/3 product show hobe
// header color should be change
// teaware dropdown size should be squize
// home page e new release section e "shop our tea" text ta change hobe
