import httpStatus from "http-status";
import { AddressService } from "../../service/secure/address.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const getAddresses = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await AddressService.getAddresses(userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrieved successfully!",
    meta: null,
    data: result,
  });
});

const deleteAddress = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { userId } = req.user;

  const result = await AddressService.deleteAddress(data, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully!",
    meta: null,
    data: result,
  });
});

const editAddress = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { userId } = req.user;

  const result = await AddressService.editAddress(data, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Edited successfully!",
    meta: null,
    data: result,
  });
});

const addAddress = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { userId } = req.user;

  const result = await AddressService.addAddress(data, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const AddressController = {
  getAddresses,
  deleteAddress,
  editAddress,
  addAddress,
};
