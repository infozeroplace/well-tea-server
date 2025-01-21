import { z } from "zod";
import { assortments } from "../constant/assortment.constant.js";

const addAssortmentSchema = z.object({
  body: z.object({
    assortment: z.string({ required_error: "Assortment is required" }),
    assortmentType: z.enum([...assortments], {
      required_error: "Assortment type is required",
    }),
  }),
});

export const AssortmentValidation = {
  addAssortmentSchema,
};
