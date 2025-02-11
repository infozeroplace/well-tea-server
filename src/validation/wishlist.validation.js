import { z } from 'zod';

const addToWishlistSchema = z.object({
  body: z.object({
    productId: z.string({ required_error: 'product id is required' }),
  }),
});

export const WishlistValidation = {
  addToWishlistSchema,
};
