import { productTeaSearchableFields } from "../../constant/product.constant.js";
import { PaginationHelpers } from "../../helper/paginationHelper.js";
import { Tea } from "../../model/products.model.js";

const getProductTeaList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: productTeaSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
      type: (value) => {
        const types = value.split(",");
        return {
          type: {
            $in: types,
          },
        };
      },
      format: (value) => {
        const formats = value.split(",");
        return {
          format: {
            $in: formats,
          },
        };
      },
      benefit: (value) => {
        const benefits = value.split(",");
        return {
          benefit: {
            $in: benefits,
          },
        };
      },
      flavour: (value) => {
        const flavours = value.split(",");
        return {
          flavour: {
            $in: flavours,
          },
        };
      },
      ingredient: (value) => {
        const ingredients = value.split(",");
        return {
          ingredient: {
            $in: ingredients,
          },
        };
      },
      price: (value) => {
        const [min, max] = value.split("-").map(Number);
        return {
          "unitPrices.0.price": {
            $gte: min, // Minimum price condition
            $lte: max, // Maximum price condition
          },
        };
      },
      default: (field, value) => ({
        [field]: value,
      }),
    };

    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => {
          const handler = filterHandlers[field] || filterHandlers.default;
          return handler(field === "default" ? [field, value] : value);
        }),
      });
    }
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const sortConditions = {};

  if (sortBy && sortOrder) {
    if (sortBy === "price") {
      sortConditions["unitPrices.0.price"] = sortOrder;
    } else {
      sortConditions[sortBy] = sortOrder;
    }
  }

  const pipelines = [
    {
      $match: whereConditions,
    },
    {
      $addFields: {
        unitPrices: {
          $map: {
            input: "$unitPrices",
            as: "unitPrice",
            in: {
              unit: "$$unitPrice.unit",
              price: "$$unitPrice.price",
              salePrice: {
                $cond: {
                  if: "$isSale",
                  then: {
                    $round: [
                      {
                        $subtract: [
                          "$$unitPrice.price",
                          { $multiply: ["$$unitPrice.price", { $divide: ["$sale", 100] }] },
                        ],
                      },
                      2, // Round to 2 decimal places
                    ],
                  },
                  else: 0,
                },
              },
              subscriptionPrice: {
                $cond: {
                  if: { $and: ["$isSubscription"] },
                  then: {
                    $round: [
                      {
                        $subtract: [
                          "$$unitPrice.price",
                          { $multiply: ["$$unitPrice.price", { $divide: ["$subscriptionSale", 100] }] },
                        ],
                      },
                      2, // Round to 2 decimal places
                    ],
                  },
                  else: 0,
                },
              },
            },
          },
        },
      },
    },
    {
      $sort: sortConditions,
    },
  ];

  const options = {
    page,
    limit,
  };

  const result = await Tea.aggregatePaginate(pipelines, options);

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

export const ProductService = {
  getProductTeaList,
};
