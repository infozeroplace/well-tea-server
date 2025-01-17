import httpStatus from "http-status";
import { brewInstructionSearchableFields } from "../../constant/brewInstruction.constant.js";
import ApiError from "../../error/ApiError.js";
import { PaginationHelpers } from "../../helper/paginationHelper.js";
import BrewInstruction from "../../model/brewInstruction.model.js";

const deleteBrewInstructions = async (ids) => {
  const result = await BrewInstruction.deleteMany({
    _id: { $in: ids },
  });

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  return result;
};

const getAllBrewInstructionList = async () => {
  const result = await BrewInstruction.find({});
  return result;
};

const deleteBrewInstruction = async (payload) => {
  const { id } = payload;

  const isExisting = await BrewInstruction.findById(id);

  if (!isExisting) throw new ApiError(httpStatus.BAD_REQUEST, "Not found!");

  const result = await BrewInstruction.findByIdAndDelete(id);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  return result;
};

const getBrewInstructionList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: brewInstructionSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const sortConditions = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const pipelines = [
    {
      $match: whereConditions,
    },
    {
      $sort: sortConditions,
    },
  ];

  const options = {
    page,
    limit,
  };

  const result = await BrewInstruction.aggregatePaginate(pipelines, options);

  const { docs, totalDocs } = result;

  return {
    meta: {
      page,
      limit,
      totalDocs,
    },
    data: docs,
  };
};

const addInstruction = async (payload) => {
  const result = await BrewInstruction.create(payload);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  return result;
};

export const BrewInstructionService = {
  deleteBrewInstructions,
  getAllBrewInstructionList,
  deleteBrewInstruction,
  getBrewInstructionList,
  addInstruction,
};
