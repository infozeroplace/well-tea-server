import { z } from 'zod';
import { countries } from '../constant/common.constant.js';

const addShippingSchema = z.object({
  body: z.object({
    zoneName: z.string({ required_error: 'zone name is required' }),
    countries: z
      .array(
        z.enum([...countries], {
          required_error: 'countries is required',
        }),
      ),
    methods: z
      .array(
        z.object({
          title: z.string({ required_error: 'title is required' }),
          cost: z
            .number({ required_error: 'cost is required' })
            .min(0, { message: 'cost must be a positive number' }),
        }),
      )
      .nonempty({ message: 'at least one shipping method is required' }),
  }),
});

export const ShippingValidation = {
  addShippingSchema,
};
