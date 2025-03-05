import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const MenuSchema = Schema(
  {
    menuId: {
      type: String,
      default: 'menu-1',
    },
    tea: {
      productType: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
      flavor: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
      format: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
      benefit: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
      discover: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
      ],
      origin: [],
      featured: {
        thumbnail: {
          type: Schema.Types.ObjectId,
          ref: 'Assortment',
        },
        title: String,
        route: String,
      },
    },
  },
  { timestamps: true },
);

MenuSchema.plugin(mongoosePlugin);
const Menu = model('Menu', MenuSchema);

export default Menu;
