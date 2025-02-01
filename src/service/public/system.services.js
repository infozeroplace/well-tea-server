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

  const { filters } = result;

  return {
    ...result.toObject(),
    filters: [
      {
        category: "all",
        title: "Price",
        key: "price",
        options: [
          { _id: "1", param: "0-25" },
          { _id: "2", param: "26-40" },
          { _id: "3", param: "41-65" },
          { _id: "4", param: "66-75" },
          { _id: "5", param: "66-85" },
          { _id: "6", param: "76-95" },
          { _id: "7", param: "76-100" },
        ],
      },
      ...filters,
    ],
  };
};

export const SystemService = {
  getTeaTypes,
  getSystemConfig,
};
