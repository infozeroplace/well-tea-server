const calcItems = payload => {
  const data = {
    ...payload,
    totalPrice: 0,
    totalQuantity: 0,
  };

  const updatedItems = data.items.map(
    ({
      productId,
      unitPriceId,
      unitPrices,
      subscriptionId,
      subscriptions,
      thumbnails,
      title,
      urlParameter,
      purchaseType,
      quantity,
      addedAt,
      isSale,

      isMultiDiscount,
      multiDiscountQuantity,
      multiDiscountAmount,
    }) => {
      const unitPrice = {
        ...unitPrices.find(i => i._id.toString() === unitPriceId),
      };

      const price =
        purchaseType === 'one_time'
          ? isSale
            ? Number(unitPrice.salePrice.toFixed(2))
            : Number(unitPrice.price.toFixed(2))
          : Number(unitPrice.subscriptionPrice.toFixed(2));

      const tPrice = price * quantity;
      const subtractPrice = isMultiDiscount
        ? quantity >= multiDiscountQuantity
          ? multiDiscountAmount
          : 0
        : 0;

      const totalPrice = Number((tPrice - subtractPrice).toFixed(2));

      const unit = unitPrice.unit;

      const subscription =
        subscriptions.find(i => i._id.toString() === subscriptionId)?.weeks ||
        '';

      const thumbnail = {
        filepath: thumbnails[0].filepath,
        alternateText: thumbnails[0].alternateText,
      };

      const newItem = {
        thumbnail,
        title,
        productId,
        unitPriceId,
        subscriptionId,
        subscription,
        purchaseType,
        urlParameter,
        unit,
        price,
        quantity,
        totalPrice,
        addedAt,
      };

      data.totalPrice += totalPrice;
      data.totalQuantity += quantity;

      return newItem;
    },
  );

  data.items = updatedItems;

  return data;
};

export default calcItems;
