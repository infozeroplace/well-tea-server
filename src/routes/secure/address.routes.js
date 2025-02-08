import express from "express";
import { AddressController } from "../../controller/secure/address.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { AddressValidation } from "../../validation/address.validation.js";

const router = express.Router();

router.get(
  "/address/get",
  auth(ENUM_USER_ROLE.USER),
  AddressController.getAddresses
);

router.delete(
  "/address/delete",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(AddressValidation.deleteAddressSchema),
  AddressController.deleteAddress
);

router.put(
  "/address/edit",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(AddressValidation.editAddressSchema),
  AddressController.editAddress
);

router.post(
  "/address/add",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(AddressValidation.addAddressSchema),
  AddressController.addAddress
);

export const AddressRoutes = router;
