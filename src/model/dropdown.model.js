import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const DropdownSchema = Schema(
  {
    pattern: String,
    title: String,
    productType: {
      columnTitle: String,
      children: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
    },
    teaFlavor: {
      columnTitle: String,
      children: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
    },
    attribute: {
      columnTitle: String,
      children: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
    },
    teaFormat: {
      columnTitle: String,
      children: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
    },
    origin: {
      columnTitle: String,
      children: [String],
    },
    teaBenefit: {
      columnTitle: String,
      children: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
    },
    featured1: {
      thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
        default: null,
      },
      title: String,
      route: String,
    },
    featured2: {
      thumbnail: {
        type: Schema.Types.ObjectId,
        ref: 'Media',
        default: null,
      },
      title: String,
      route: String,
    },
  },
  { timestamps: true },
);

DropdownSchema.plugin(mongoosePlugin);
const Dropdown = model('Dropdown', DropdownSchema);

export default Dropdown;
