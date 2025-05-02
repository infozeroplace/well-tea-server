import { z } from "zod";
import { countries } from "../constant/common.constant.js";

const deleteAddressSchema = z.object({
  body: z.object({
    addressId: z.string({ required_error: "address id is required" }),
  }),
});

const editAddressSchema = z.object({
  body: z.object({
    addressId: z.string({ required_error: "address id is required" }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    country: z.string(z.enum([...countries])).optional(),
    postalCode: z.string().optional(),
    phone: z.string().optional(),
    isDefault: z.boolean().optional(),
  }),
});

const addAddressSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: "first name is required" }),
    lastName: z.string({ required_error: "last name is required" }),
    company: z.string().optional(),
    address1: z.string({ required_error: "address 1 is required" }),
    address2: z.string().optional(),
    city: z.string({ required_error: "city is required" }),
    country: z.string(
      z.enum([...countries], {
        required_error: "country is required",
      })
    ),
    postalCode: z.string({ required_error: "postal code is required" }),
    phone: z.string({ required_error: "phone is required" }),
    isDefault: z.boolean({ required_error: "default value is required" }),
  }),
});

export const AddressValidation = {
  deleteAddressSchema,
  editAddressSchema,
  addAddressSchema,
};
