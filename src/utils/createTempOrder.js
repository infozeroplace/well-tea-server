import mongoose from 'mongoose';
import { cartPipeline } from '../constant/common.constant.js';
import Cart from '../model/cart.model.js';
import ShippingMethod from '../model/shippingMethod.js';
import TempOrder from '../model/tempOrder.model.js';
import User from '../model/user.model.js';
import calcItems from './calculateCartItems.js';
import generateOrderId from './generateOrderId.js';

const { ObjectId } = mongoose.Types;

const createTempOrder = async (payload, userId) => {
  const { email, cartId, billingAddress, shippingAddress, shippingMethodId } =
    payload;

  const pipelines = [
    {
      $match: {
        _id: new ObjectId(cartId),
      },
    },
    ...cartPipeline,
  ];

  const { docs } = await Cart.aggregatePaginate(pipelines);

  const cartData = calcItems(docs[0]);
  const items = cartData.items;
  const isItemsExists = items.length > 0;

  if (!isItemsExists) {
    return { isItemsExists };
  }
  
  const shippingMethod = await ShippingMethod.findOne({
    'methods._id': shippingMethodId,
  });

  const method = shippingMethod.methods.find(
    m => m._id.toString() === shippingMethodId,
  );

  const subtotal = Number(cartData?.totalPrice.toFixed(2)) || 0;
  const shipping = Number(method?.cost.toFixed(2)) || 0;
  const total = Number((subtotal + shipping).toFixed(2));
  
  const subscriptionItems = items.filter(
    item => item.purchaseType === 'subscribe',
  );

  const onetimeItems = items.filter(item => item.purchaseType === 'one_time');
  
  const orderId = await generateOrderId();
  
  let user = null;
  if (userId) {
    user = await User.findOne({ userId });
  }
  
  const orderData = {
    email,
    orderId,
    user: user ? user._id : user,
    cart: new ObjectId(cartId),
    shippingMethod: new ObjectId(shippingMethodId),
    shippingAddress,
    billingAddress,
    customerType: user ? 'user' : 'guest',
    subtotal,
    shipping,
    total,
    items,
  };

  await TempOrder.create(orderData);

  return {
    email,
    firstName: shippingAddress?.firstName || '',
    lastName: shippingAddress?.lastName || '',
    total,
    orderId,
    shippingMethodId,
    isItemsExists,
    subscriptionItems,
    onetimeItems,
  };
};

export default createTempOrder;
