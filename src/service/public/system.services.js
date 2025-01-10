import { System } from "../../model/system.model.js";

const getSystemConfig = async () => {
  const result = await System.findOne({ systemId: "system-1" });

  return result;
};

export const SystemService = {
  getSystemConfig,
};
