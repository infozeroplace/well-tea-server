import { countries } from "./common.constant.js";

export const addressSearchableFields = [
  'userId',
  'firstName',
  'lastName',
  'company',
  'address1',
  'address2',
  'city',
  'country',
  'postalCode',
  'phone',
];

export const addressFilterableField = ['searchTerm', 'country'];


export const address = {
  firstName: {
    type: String,
    trim: true,
    required: [true, 'first name is required'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'last name is required'],
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  address1: {
    type: String,
    trim: true,
    required: [true, 'address 1 is required'],
  },
  address2: {
    type: String,
    trim: true,
    default: '',
  },
  city: {
    type: String,
    trim: true,
    required: [true, 'city is required'],
  },
  country: {
    type: String,
    trim: true,
    required: [true, 'country is required'],
    enum: {
      values: [...countries],
      message: '{VALUE} is not matched',
    },
  },
  postalCode: {
    type: String,
    trim: true,
    required: [true, 'postal code is required'],
  },
  phone: {
    type: String,
    trim: true,
    required: [true, 'phone is required'],
    set: value => value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' '),
  },
};
