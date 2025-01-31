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

  return {
    ...result.toObject(),
    filters: [
      {
        category: "tea",
        title: "Types",
        key: "productType",
        options: [
          { param: "green tea" },
          { param: "white tea" },
          { param: "black tea" },
          { param: "oolong tea" },
          { param: "herbal tea" },
          { param: "flowering tea" },
          { param: "jasmine tea" },
          { param: "yellow tea" },
          { param: "matcha" },
        ],
      },
      {
        category: "tea",
        title: "Tea Format",
        key: "teaFormat",
        options: [
          { param: "loose leaf" },
          { param: "tea caddy" },
          { param: "tea bag" },
        ],
      },
      {
        category: "tea",
        title: "Price",
        key: "price",
        options: [{ param: "0-25" }, { param: "26-40" }, { param: "41-65" }],
      },
      {
        category: "tea",
        key: "teaBenefit",
        title: "Health Benefit",
        options: [
          { param: "energy" },
          { param: "gut health" },
          { param: "immunity" },
        ],
      },
      {
        category: "tea",
        title: "Flavour",
        key: "teaFlavor",
        options: [
          { param: "citrus" },
          { param: "flavoured" },
          { param: "floral" },
          { param: "fruity" },
          { param: "smoke" },
          { param: "spice" },
          { param: "sweet" },
        ],
      },
    ],
  };
};

export const SystemService = {
  getTeaTypes,
  getSystemConfig,
};
