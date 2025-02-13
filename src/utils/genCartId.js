import { v4 as uuidv4 } from 'uuid';
import Cart from '../model/cart.model.js';

const genCartId = async () => {
  let randomId;
  let isExists;

  do {
    randomId = uuidv4();
    isExists = await Cart.exists({ guestId: randomId }); // More efficient than `findOne`
  } while (isExists); // Keep generating until we get a unique ID

  return randomId;
};

export default genCartId;
