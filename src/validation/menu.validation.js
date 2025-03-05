import { z } from 'zod';

const addMenu = z.object({
  body: z.object({
    assortment: z.string({ required_error: 'assortment is required' }),
  }),
});

export const MenuValidation = {
  addMenu,
};
