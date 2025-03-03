import { z } from 'zod';

const deleteProductsSchema = z.object({
  body: z.object({
    ids: z.array(z.string(), {
      required_error: 'IDs required',
    }),
  }),
});

const deleteProductSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID is required' }),
  }),
});

const brewInstructionSchema = z.object({
  title: z.string({ required_error: 'Title is required for howToMakeTea' }),
  requirements: z
    .array(z.string(), {
      required_error: 'Requirements must be an array of strings',
    })
    .min(1, { message: 'At least one requirement is required' }),
  steps: z
    .array(z.string(), {
      required_error: 'Steps must be an array of strings',
    })
    .min(1, { message: 'At least one step is required' }),
});

const unitPriceSchema = z.object({
  unit: z.string({ required_error: 'Unit is required' }),
  price: z.number({ required_error: 'Price is required' }),
});

const subscriptionSchema = z.object({
  weeks: z.string({ required_error: 'Weeks is required' }),
  days: z.number({ required_error: 'Days is required' }),
});

const editProductSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID is required' }),
    urlParameter: z.string().optional(),
    sku: z.string().optional(),
    title: z.string().optional(),
    longDescription: z.string().optional(),
    shortDescription: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    thumbnails: z.array(z.string()).optional(),
    slideImages: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
    attribute: z.array(z.string()).optional(),
    productType: z.array(z.string()).optional(),
    teaFormat: z.array(z.string()).optional(),
    teaFlavor: z.array(z.string()).optional(),
    teaIngredient: z.array(z.string()).optional(),
    teaBenefit: z.array(z.string()).optional(),
    origin: z.array(z.string()).optional(),
    originLocation: z.string().optional(),
    youtubeLink: z.string().optional(),
    isStock: z
      .boolean({
        invalid_type_error: 'IsStock must be a boolean',
      })
      .optional(),
    isNewProduct: z
      .boolean({
        invalid_type_error: 'isNewProduct must be a boolean',
      })
      .optional(),
    isBestSeller: z
      .boolean({
        invalid_type_error: 'IsBestSeller must be a boolean',
      })
      .optional(),
    isFeatured: z
      .boolean({
        invalid_type_error: 'IsFeatured must be a boolean',
      })
      .optional(),
    isSale: z
      .boolean({
        invalid_type_error: 'IsSale must be a boolean',
      })
      .optional(),
    isSubscription: z
      .boolean({
        invalid_type_error: 'IsSubscription must be a boolean',
      })
      .optional(),
    isMultiDiscount: z
      .boolean({
        invalid_type_error: 'isMultiDiscount must be a boolean',
      })
      .optional(),
    sale: z.number({ invalid_type_error: 'sale must be a number' }).optional(),
    subscriptionSale: z
      .number({
        invalid_type_error: 'subscriptionSale must be a number',
      })
      .optional(),
    multiDiscountQuantity: z
      .number({
        invalid_type_error: 'multiDiscountQuantity must be a number',
      })
      .optional(),
    multiDiscountAmount: z
      .number({
        invalid_type_error: 'multiDiscountAmount must be a number',
      })
      .optional(),
    ratings: z
      .number({
        invalid_type_error: 'ratings must be a number',
      })
      .optional(),
    reviews: z.array(z.string()).optional(),
    availableAs: z.array(z.string()).optional(),
    addOns: z.array(z.string()).optional(),
    brewInstruction: z.string().optional(),
    unitPrices: z.array(unitPriceSchema).optional(),
    subscriptions: z.array(subscriptionSchema).optional(),
  }),
});

const addProductSchema = z.object({
  body: z.object({
    urlParameter: z.string({ required_error: 'URL parameter is required' }),
    sku: z.string({ required_error: 'SKU is required' }),
    title: z.string({ required_error: 'Title is required' }),
    longDescription: z.string({
      required_error: 'Long description is required',
    }),
    shortDescription: z.string({
      required_error: 'Short description is required',
    }),
    metaTitle: z.string({ required_error: 'Meta title is required' }),
    metaDescription: z.string({
      required_error: 'Meta description is required',
    }),
    thumbnails: z.array(z.string(), {
      required_error: 'Thumbnails must be an array of strings',
    }),
    slideImages: z.array(z.string(), {
      required_error: 'Slide images must be an array of strings',
    }),
    category: z.array(z.string(), {
      required_error: 'Category must be an array of strings',
    }),
    attribute: z.array(z.string()).optional(),
    productType: z
      .array(z.string(), {
        required_error: 'Product type must be an array of strings',
      })
      .optional(),
    teaFormat: z.array(z.string()).optional(),
    teaFlavor: z.array(z.string()).optional(),
    teaIngredient: z.array(z.string()).optional(),
    teaBenefit: z.array(z.string()).optional(),
    origin: z.array(z.string()).optional(),
    originLocation: z.string().optional(),
    youtubeLink: z.string().optional(),
    isStock: z
      .boolean({
        invalid_type_error: 'IsStock must be a boolean',
      })
      .optional(),
    isNewProduct: z
      .boolean({
        invalid_type_error: 'isNewProduct must be a boolean',
      })
      .optional(),
    isBestSeller: z
      .boolean({
        invalid_type_error: 'IsBestSeller must be a boolean',
      })
      .optional(),
    isFeatured: z
      .boolean({
        invalid_type_error: 'IsFeatured must be a boolean',
      })
      .optional(),
    isSale: z
      .boolean({
        invalid_type_error: 'IsSale must be a boolean',
      })
      .optional(),
    isSubscription: z
      .boolean({
        invalid_type_error: 'IsSubscription must be a boolean',
      })
      .optional(),
    isMultiDiscount: z
      .boolean({
        invalid_type_error: 'isMultiDiscount must be a boolean',
      })
      .optional(),
    sale: z.number({ invalid_type_error: 'sale must be a number' }).optional(),
    subscriptionSale: z
      .number({
        invalid_type_error: 'subscriptionSale must be a number',
      })
      .optional(),
    multiDiscountQuantity: z
      .number({
        invalid_type_error: 'multiDiscountQuantity must be a number',
      })
      .optional(),
    multiDiscountAmount: z
      .number({
        invalid_type_error: 'multiDiscountAmount must be a number',
      })
      .optional(),
    ratings: z
      .number({
        invalid_type_error: 'ratings must be a number',
      })
      .optional(),
    reviews: z.array(z.string()).optional(),
    availableAs: z.array(z.string()).optional(),
    addOns: z.array(z.string()).optional(),
    brewInstruction: z.string().optional(),
    unitPrices: z
      .array(unitPriceSchema, {
        required_error: 'Unit prices must be an array of objects',
      })
      .min(1, { message: 'At least one unit price is required' }),
    subscriptions: z
      .array(subscriptionSchema, {
        required_error: 'Subscriptions must be an array of objects',
      })
      .optional(),
  }),
});

export const ProductValidation = {
  deleteProductsSchema,
  deleteProductSchema,
  editProductSchema,
  addProductSchema,
};
