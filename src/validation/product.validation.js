import { z } from "zod";
import { productCategories } from "../constant/product.constant.js";

const deleteProductSchema = z.object({
  body: z.object({
    id: z.string({ required_error: "ID is required" }),
  }),
});

const howToMakeTeaItemSchema = z.object({
  title: z.string({ required_error: "Title is required for howToMakeTea" }),
  requirements: z
    .array(z.string(), {
      required_error: "Requirements must be an array of strings",
    })
    .min(1, { message: "At least one requirement is required" }),
  steps: z
    .array(z.string(), {
      required_error: "Steps must be an array of strings",
    })
    .min(1, { message: "At least one step is required" }),
});

const unitPriceSchema = z.object({
  unit: z.string({ required_error: "Unit is required" }),
  price: z.number({ required_error: "Price is required" }),
});

const subscriptionSchema = z.object({
  weeks: z.string({ required_error: "Weeks is required" }),
  days: z.number({ required_error: "Days is required" }),
});

const addProductSchema = z.object({
  body: z.object({
    urlParameter: z.string({ required_error: "urlParameter is required" }),
    sku: z.string({ required_error: "sku is required" }),
    title: z.string({ required_error: "Title is required" }),
    longDescription: z.string({ required_error: "Description is required" }),
    shortDescription: z.string({
      required_error: "Short description is required",
    }),
    thumbnails: z.array(z.string(), {
      required_error: "Thumbnails must be an array of strings",
    }),
    slideImages: z.array(z.string(), {
      required_error: "Slide images must be an array of strings",
    }),
    category: z.array(
      z.enum(productCategories, {
        required_error: "Category must be an array of valid strings",
      })
    ),
    keyword: z.array(z.string(), {
      required_error: "keyword must be an array of strings",
    }),
    type: z.array(z.string(), {
      required_error: "Type must be an array of strings",
    }),
    format: z.array(z.string(), {
      required_error: "Format must be an array of strings",
    }),
    flavour: z.array(z.string(), {
      required_error: "Flavour must be an array of strings",
    }),
    ingredient: z.array(z.string(), {
      required_error: "Ingredients must be an array of strings",
    }),
    benefit: z.array(z.string(), {
      required_error: "Benefits must be an array of strings",
    }),
    originName: z.array(z.string(), {
      required_error: "origin name must be an array of strings",
    }),
    originAddress: z.string({ required_error: "Origin address is required" }),
    isStock: z.boolean({
      required_error: "IsStock is required",
      invalid_type_error: "IsStock must be a boolean",
    }),
    isNewProduct: z.boolean({
      required_error: "isNewProduct is required",
      invalid_type_error: "isNewProduct must be a boolean",
    }),
    isBestSeller: z.boolean({
      required_error: "IsBestSeller is required",
      invalid_type_error: "IsBestSeller must be a boolean",
    }),
    isFeatured: z.boolean({
      required_error: "IsFeatured is required",
      invalid_type_error: "IsFeatured must be a boolean",
    }),
    isSale: z.boolean({
      required_error: "IsSale is required",
      invalid_type_error: "IsSale must be a boolean",
    }),
    isSubscription: z.boolean({
      required_error: "IsSubscription is required",
      invalid_type_error: "IsSubscription must be a boolean",
    }),
    isMultiDiscount: z.boolean({
      required_error: "isMultiDiscount is required",
      invalid_type_error: "isMultiDiscount must be a boolean",
    }),
    sale: z.number({ required_error: "Sale is required" }),
    subscriptionSale: z.number({
      required_error: "Subscription sale is required",
    }),
    unitPrices: z
      .array(unitPriceSchema, {
        required_error: "Unit prices must be an array of objects",
      })
      .min(1, { message: "At least one unit price is required" }),
    subscriptions: z.array(subscriptionSchema, {
      required_error: "Subscriptions must be an array of objects",
    }),
    howToMakeTea: z.array(howToMakeTeaItemSchema, {
      required_error: "HowToMakeTea must be an array of objects",
    }),
  }),
});

export const ProductValidation = { deleteProductSchema, addProductSchema };
