import Coupon from '../model/coupon.model.js';

const generateRandomCoupon = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }

  return id;
};

const generateCoupon = async () => {
  let isUnique = false;
  let id;

  while (!isUnique) {
    id = generateRandomCoupon();

    const existingInvoice = await Coupon.findOne({ coupon: id });

    if (!existingInvoice) {
      isUnique = true;
    }
  }

  return id;
};

export default generateCoupon;
