import ShippingMethod from '../../model/shippingMethod.js';

const getShippingMethodList = async query => {
  if (query.country) {
    const result = await ShippingMethod.findOne({
      countries: query.country.toLowerCase(),
    });

    if (result) {
      return result;
    } else {
      const result = await ShippingMethod.findOne({
        zoneName: 'default',
      });

      return result;
    }
  } else {
    const result = await ShippingMethod.findOne({
      zoneName: 'default',
    });

    return result;
  }
};
export const ShippingService = {
  getShippingMethodList,
};
