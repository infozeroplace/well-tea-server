import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const DropdownSchema = Schema(
  {
    title: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Assortment',
    },
    children: [
      {
        columnTitle: String,
        children: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Assortment',
          },
        ],
      },
    ],
    featured: [
      {
        thumbnail: {
          type: Schema.Types.ObjectId,
          ref: 'Media',
        },
        title: String,
        route: String,
      },
    ],
  },
  { timestamps: true },
);

DropdownSchema.plugin(mongoosePlugin);
const Dropdown = model('Dropdown', DropdownSchema);

export default Dropdown;
