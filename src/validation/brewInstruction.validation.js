import { z } from "zod";

const addBrewInstructionSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    requirements: z.array(z.string(), {
      required_error: "Requirements must be an array of strings",
    }),
    steps: z.array(z.string(), {
      required_error: "Steps must be an array of strings",
    }),
  }),
});

export const BrewInstructionValidation = {
  addBrewInstructionSchema,
};
