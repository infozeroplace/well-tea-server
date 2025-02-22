import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';
import { countries } from '../constant/common.constant.js';

const ShippingMethodSchema = Schema(
  {
    zoneName: {
      type: String,
      required: [true, 'zone name is required'],
      set: value => value.trim().toLowerCase(),
    },
    countries: {
      type: [String],
      required: [true, 'countries is required'],
      enum: {
        values: [...countries],
        message: '{VALUE} is not matched',
      },
      set: values => values.map(value => value.trim().toLowerCase()),
    },
    methods: {
      type: [
        {
          title: {
            type: String,
            required: [true, 'title is required'],
          },
          cost: {
            type: Number,
            required: [true, 'cost is required'],
          },
        },
      ],
      required: [true, 'methods is required'],
    },
  },
  { timestamps: true },
);

ShippingMethodSchema.plugin(mongoosePlugin);
const ShippingMethod = model('ShippingMethod', ShippingMethodSchema);

export default ShippingMethod;
