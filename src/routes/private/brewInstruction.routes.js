import express from "express";
import { BrewInstructionController } from "../../controller/private/brewInstruction.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { BrewInstructionValidation } from "../../validation/brewInstruction.validation.js";

const router = express.Router();

router.delete(
  "/brew-instruction/delete-brew-instructions",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BrewInstructionController.deleteBrewInstructions
);

router.get(
  "/brew-instruction/get-all-brew-instruction-list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BrewInstructionController.getAllBrewInstructionList
);

router.delete(
  "/brew-instruction/delete-brew-instruction",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BrewInstructionController.deleteBrewInstruction
);

router.get(
  "/brew-instruction/list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BrewInstructionController.getBrewInstructionList
);

router.post(
  "/brew-instruction/add-instruction",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BrewInstructionValidation.addBrewInstructionSchema),
  BrewInstructionController.addInstruction
);

export const BrewInstructionRoutes = router;
