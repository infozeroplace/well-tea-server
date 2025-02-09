import httpStatus from "http-status";
import ApiError from "../../error/ApiError.js";
import Address from "../../model/address.model.js";

const getAddresses = async (userId) => {
  const addresses = await Address.find({ userId });

  return addresses;
};

const deleteAddress = async (payload, userId) => {
  const { addressId } = payload;

  const existedAddress = await Address.findById(addressId);

  if (!existedAddress)
    throw new ApiError(httpStatus.BAD_REQUEST, "address is not found!");

  if (existedAddress.userId !== userId)
    throw new ApiError(httpStatus.BAD_REQUEST, "user is not matched!");

  const existedAddresses = await Address.find({ userId });

  if (existedAddress.isDefault && existedAddresses.length > 1) {
    await Address.findByIdAndUpdate(existedAddresses[1]._id, {
      $set: { isDefault: true },
    });
  }

  const result = await Address.findByIdAndDelete(addressId);

  return result;
};

const editAddress = async (payload, userId) => {
  const { addressId } = payload;

  const existedAddress = await Address.findById(addressId);

  if (!existedAddress)
    throw new ApiError(httpStatus.BAD_REQUEST, "address not found!");

  const existedAddresses = await Address.find({ userId });

  const isDefaultExists = existedAddresses.find((i) => i.isDefault === true);

  if (payload.isDefault && isDefaultExists) {
    await Address.findByIdAndUpdate(isDefaultExists._id, {
      $set: { isDefault: false },
    });
  }

  payload.userId = userId;

  const result = await Address.findByIdAndUpdate(addressId, payload, {
    new: true,
  });

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "try again!");

  return result;
};

const addAddress = async (payload, userId) => {
  const existedAddresses = await Address.find({ userId });

  if (existedAddresses.length > 4)
    throw new ApiError(httpStatus.BAD_REQUEST, "Too many addresses!");

  if (!payload.isDefault && 0 >= existedAddresses.length) {
    payload.isDefault = true;
  }

  const isDefaultExists = existedAddresses.find((i) => i.isDefault === true);

  if (payload.isDefault && isDefaultExists) {
    await Address.findByIdAndUpdate(isDefaultExists._id, {
      $set: { isDefault: false },
    });
  }

  const newData = {
    userId,
    ...payload,
  };

  const result = await Address.create(newData);

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "Try again!");

  return result;
};

export const AddressService = {
  getAddresses,
  deleteAddress,
  editAddress,
  addAddress,
};
