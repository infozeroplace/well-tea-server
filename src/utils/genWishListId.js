import { v4 as uuidv4 } from 'uuid';
import Wishlist from '../model/wishlist.model.js';

const genWishListId = async () => {
  let randomId;
  let isExists;

  do {
    randomId = uuidv4();
    isExists = await Wishlist.exists({ guestId: randomId }); // More efficient than `findOne`
  } while (isExists); // Keep generating until we get a unique ID

  return randomId;
};

export default genWishListId;
