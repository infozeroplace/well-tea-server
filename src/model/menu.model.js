import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const MenuSchema = Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Assortment',
    },
    dropdown: {
      type: Schema.Types.ObjectId,
      ref: 'Dropdown',
      default: null,
    },
  },
  { timestamps: true },
);

MenuSchema.plugin(mongoosePlugin);
const Menu = model('Menu', MenuSchema);

export default Menu;
