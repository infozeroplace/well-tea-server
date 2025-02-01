import { System } from "../../model/system.model.js";

const getTeaTypes = async () => {
  return [
    "green tea",
    "black tea",
    "organic tea",
    "oolong tea",
    "herbal tea",
    "white tea",
    "pureh tea",
    "jasmine tea",
    "flowering tea",
    "yellow tea",
  ];
};

const getSystemConfig = async () => {
  const result = await System.findOne({ systemId: "system-1" });

  return result;
};

export const SystemService = {
  getTeaTypes,
  getSystemConfig,
};