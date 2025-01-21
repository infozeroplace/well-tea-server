import httpStatus from "http-status";
import { productSearchableFields } from "../../constant/product.constant.js";
import ApiError from "../../error/ApiError.js";
import { PaginationHelpers } from "../../helper/paginationHelper.js";
import Product from "../../model/products.model.js";

const getProduct = async (slug) => {
  const pipeline = [
    {
      $match: {
        urlParameter: { $regex: new RegExp(`^${slug}$`, "i") },
      },
    },
    {
      $lookup: {
        from: "reviews", // The name of the collection storing reviews
        localField: "reviews", // Field in the current document
        foreignField: "_id", // Field in the `reviews` collection
        as: "reviews", // Output array in the resulting document
      },
    },
    {
      $unwind: {
        path: "$reviews",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users", // The name of the collection storing users
        localField: "reviews.user", // Field in the `reviews` document
        foreignField: "_id", // Field in the `users` collection
        as: "reviewUser", // Output array for user details
      },
    },
    {
      $unwind: {
        path: "$reviewUser",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        "reviews.userName": "$reviewUser.name", // Assuming `name` field exists in the `users` collection
      },
    },
    {
      $group: {
        _id: "$_id",
        urlParameter: { $first: "$urlParameter" },
        sku: { $first: "$sku" },
        title: { $first: "$title" },
        longDescription: { $first: "$longDescription" },
        shortDescription: { $first: "$shortDescription" },
        metaTitle: { $first: "$metaTitle" },
        metaDescription: { $first: "$metaDescription" },
        thumbnails: { $first: "$thumbnails" },
        slideImages: { $first: "$slideImages" },
        category: { $first: "$category" },
        attribute: { $first: "$attribute" },
        productType: { $first: "$productType" },
        teaFormat: { $first: "$teaFormat" },
        teaFlavor: { $first: "$teaFlavor" },
        teaIngredient: { $first: "$teaIngredient" },
        teaBenefit: { $first: "$teaBenefit" },
        origin: { $first: "$origin" },
        originLocation: { $first: "$originLocation" },
        isStock: { $first: "$isStock" },
        isNewProduct: { $first: "$isNewProduct" },
        isBestSeller: { $first: "$isBestSeller" },
        isFeatured: { $first: "$isFeatured" },
        isSale: { $first: "$isSale" },
        isSubscription: { $first: "$isSubscription" },
        isMultiDiscount: { $first: "$isMultiDiscount" },
        sale: { $first: "$sale" },
        subscriptionSale: { $first: "$subscriptionSale" },
        multiDiscountQuantity: { $first: "$multiDiscountQuantity" },
        multiDiscountAmount: { $first: "$multiDiscountAmount" },
        ratings: { $first: "$ratings" },
        reviews: {
          $push: {
            _id: "$reviews._id",
            ratingPoints: "$reviews.ratingPoints",
            reviewText: "$reviews.reviewText",
            userName: "$reviews.userName",
            date: "$reviews.date",
          },
        },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "availableAs",
        foreignField: "_id",
        as: "availableAs",
      },
    },
    {
      $lookup: {
        from: "brewinstructions",
        localField: "brewInstruction",
        foreignField: "_id",
        as: "brewInstruction",
      },
    },
    {
      $addFields: {
        availableAs: {
          $map: {
            input: "$availableAs",
            as: "product",
            in: {
              urlParameter: "$$product.urlParameter",
              teaFormat: "$$product.teaFormat",
            },
          },
        },
      },
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
                          {
                            $multiply: [
                              "$$unitPrice.price",
                              { $divide: ["$sale", 100] },
                            ],
                          },
                        ],
                      },
                      2,
                    ],
                  },
                  else: 0,
                },
              },
              subscriptionPrice: {
                $cond: {
                  if: "$isSubscription",
                  then: {
                    $round: [
                      {
                        $subtract: [
                          "$$unitPrice.price",
                          {
                            $multiply: [
                              "$$unitPrice.price",
                              { $divide: ["$subscriptionSale", 100] },
                            ],
                          },
                        ],
                      },
                      2,
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
      $limit: 1,
    },
  ];

  const result = await Product.aggregate(pipeline);

  if (!result || result.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found!");
  }

  return result[0];
};

const getProductList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  // console.log(filters)
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: productSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
      category: (value) => {
        const categories = value.split(",");
        return {
          category: {
            $in: categories,
          },
        };
      },
      keyword: (value) => {
        const keywords = value.split(",");
        return {
          keyword: {
            $in: keywords,
          },
        };
      },
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
      originName: (value) => {
        const countries = value.split(",");
        return {
          originName: {
            $in: countries,
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
      isBestSeller: (value) => {
        return {
          isBestSeller: {
            $in: [value === "true"],
          },
        };
      },
      isFeatured: (value) => {
        return {
          isFeatured: {
            $in: [value === "true"],
          },
        };
      },
      isSale: (value) => {
        return {
          isSale: {
            $in: [value === "true"],
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
                          {
                            $multiply: [
                              "$$unitPrice.price",
                              { $divide: ["$sale", 100] },
                            ],
                          },
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
                          {
                            $multiply: [
                              "$$unitPrice.price",
                              { $divide: ["$subscriptionSale", 100] },
                            ],
                          },
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

  const result = await Product.aggregatePaginate(pipelines, options);

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
  getProduct,
  getProductList,
};
