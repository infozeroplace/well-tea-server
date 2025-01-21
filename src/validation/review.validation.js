import { z } from "zod";

const addReviewSchema = z.object({
  body: z.object({
    sku: z.string({ required_error: "SKU is required" }),
    ratingPoints: z.number({ required_error: "Rating point is required" }),
    reviewText: z.string({ required_error: "Review text is required" }),
  }),
});

export const ReviewValidation = {
  addReviewSchema,
};
