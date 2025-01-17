import Assortment from "../../model/assortment.model.js";
import { System } from "../../model/system.model.js";

const getTeaTypes = async () => {
  const result = await Assortment.find({ assortmentType: "type" });
  const modifiedResult = result.map((item) => item.assortment);

  return modifiedResult;
};

const getSystemConfig = async () => {
  const result = await System.findOne({ systemId: "system-1" });

  return result;
};

export const SystemService = {
  getTeaTypes,
  getSystemConfig,
};
