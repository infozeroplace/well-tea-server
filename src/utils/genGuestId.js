import { v4 as uuidv4 } from 'uuid';
import Cart from '../model/cart.model.js';
import Wishlist from '../model/wishlist.model.js';

const genGuestId = async () => {
  let randomId;
  let isCartExists;
  let isWishlistExists;

  do {
    randomId = uuidv4();

    isCartExists = await Cart.exists({ guestId: randomId });
    isWishlistExists = await Wishlist.exists({ guestId: randomId });
  } while (isCartExists || isWishlistExists);

  return randomId;
};

export default genGuestId;
