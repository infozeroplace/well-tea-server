// ✅ Helper function to update cart items
const updateCart = async (
  cart,
  productId,
  actionType,
  purchaseType,
  quantity,
  unitPriceId,
  subscriptionId,
) => {
  const itemIndex = cart.items.findIndex(
    item =>
      item.productId.toString() === productId &&
      item.purchaseType === purchaseType &&
      item.unitPriceId?.toString() === unitPriceId?.toString() &&
      (item.subscriptionId?.toString() || '') ===
        (subscriptionId?.toString() || ''),
  );

  if (itemIndex > -1) {
    if (actionType === 'plus') {
      cart.items[itemIndex].quantity += quantity;
    } else if (actionType === 'minus') {
      cart.items[itemIndex].quantity -= quantity;
      if (cart.items[itemIndex].quantity <= 0) cart.items.splice(itemIndex, 1);
    } else if (actionType === 'absolute') {
      cart.items[itemIndex].quantity = quantity;
    }
  } else if (actionType !== 'minus') {
    cart.items.push({
      productId,
      purchaseType,
      quantity,
      unitPriceId,
      subscriptionId,
    });
  }

  await cart.save();
  return { message: 'Cart updated successfully', data: cart };
};

export default updateCart;
