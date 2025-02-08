import httpStatus from "http-status";
import ApiError from "../../error/ApiError.js";
import Address from "../../model/address.model.js";

const getAddresses = async (userId) => {
  const addresses = await Address.find({ userId });

  return addresses;
};

const deleteAddress = async (payload, userId) => {
  const { addressId } = payload;

  const existedAddresses = await Address.findById(addressId);

  if (!existedAddresses)
    throw new ApiError(httpStatus.BAD_REQUEST, "address is not found!");

  if (existedAddresses.userId !== userId)
    throw new ApiError(httpStatus.BAD_REQUEST, "user is not matched!");

  const result = await Address.findByIdAndDelete(addressId);

  return result;
};

const editAddress = async (payload, userId) => {
  const { addressId } = payload;

  const existedAddresses = await Address.findById(addressId);

  if (!existedAddresses)
    throw new ApiError(httpStatus.BAD_REQUEST, "address not found!");

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
