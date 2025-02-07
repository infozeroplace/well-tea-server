import httpStatus from "http-status";
import mongoose from "mongoose";
import { productSearchableFields } from "../../constant/product.constant.js";
import ApiError from "../../error/ApiError.js";
import { PaginationHelpers } from "../../helper/paginationHelper.js";
import Product from "../../model/products.model.js";
import escapeRegex from "../../utils/escapeRegex.js";

const getRelatedProductList = async (productIds) => {
  const ObjectId = mongoose.Types.ObjectId;

  // Ensure productIds is always an array and convert to ObjectId
  const productIdArray = (
    Array.isArray(productIds) ? productIds : [productIds]
  ).map((id) => new ObjectId(id));

  // Fetch all products using the given IDs
  const products = await Product.find({ _id: { $in: productIdArray } });

  if (!products.length) return [];

  // Collect unique categories & product types from all given products
  const categories = [...new Set(products.flatMap((p) => p.category))];
  const productTypes = [...new Set(products.flatMap((p) => p.productType))];

  const relatedProducts = await Product.aggregate([
    {
      $match: {
        _id: { $nin: productIdArray }, // Exclude provided products
        isPublished: true,
        $or: [
          { category: { $in: categories } }, // Match by category
          { productType: { $in: productTypes } }, // Match by product type
        ],
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "thumbnails",
        foreignField: "_id",
        as: "thumbnails",
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "slideImages",
        foreignField: "_id",
        as: "slideImages",
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
                      2, // Round to 2 decimal places
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
    // Flatten categories for better matching
    { $unwind: "$productType" }, // Flatten product types for better matching
    {
      $group: {
        _id: "$_id",
        product: { $first: "$$ROOT" }, // Preserve full document
        matchingCategories: {
          $sum: { $cond: [{ $in: ["$category", categories] }, 1, 0] },
        },
        matchingProductTypes: {
          $sum: { $cond: [{ $in: ["$productType", productTypes] }, 1, 0] },
        },
      },
    },
    {
      $addFields: {
        relevanceScore: {
          $add: ["$matchingCategories", "$matchingProductTypes"], // Sum relevance factors
        },
      },
    },
    { $sort: { relevanceScore: -1, "product.ratings": -1 } }, // Sort by relevance and rating
    { $limit: 5 }, // Limit results to 5 products
    { $replaceRoot: { newRoot: "$product" } }, // Extract product data
  ]);

  return relatedProducts;
};

const getProduct = async (slug) => {
  const pipeline = [
    {
      $match: {
        urlParameter: { $regex: new RegExp(`^${slug}$`, "i") },
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "_id",
        as: "reviews",
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
        from: "users",
        localField: "reviews.user",
        foreignField: "_id",
        as: "reviewUser",
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
        "reviews.firstName": "$reviewUser.firstName",
        "reviews.lastName": "$reviewUser.lastName",
        "reviews.photo": "$reviewUser.photo",
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "thumbnails",
        foreignField: "_id",
        as: "thumbnails",
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "slideImages",
        foreignField: "_id",
        as: "slideImages",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "addOns",
        foreignField: "_id",
        as: "addOns",
      },
    },
    {
      $unwind: {
        path: "$addOns",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "addOns.thumbnails",
        foreignField: "_id",
        as: "addOns.thumbnails",
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "addOns.slideImages",
        foreignField: "_id",
        as: "addOns.slideImages",
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
        youtubeLink: { $first: "$youtubeLink" },
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
        unitPrices: { $first: "$unitPrices" },
        subscriptions: { $first: "$subscriptions" },
        availableAs: { $first: "$availableAs" },
        brewInstruction: { $first: "$brewInstruction" },
        addOns: {
          $push: {
            $cond: {
              if: { $gt: ["$addOns._id", null] },
              then: "$addOns",
              else: "$$REMOVE",
            },
          },
        },
        reviews: {
          $push: {
            $cond: {
              if: { $gt: ["$reviews._id", null] },
              then: {
                _id: "$reviews._id",
                ratingPoints: "$reviews.ratingPoints",
                reviewText: "$reviews.reviewText",
                firstName: "$reviews.firstName",
                lastName: "$reviews.lastName",
                photo: "$reviews.photo",
                date: "$reviews.date",
              },
              else: "$$REMOVE",
            },
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
        addOns: {
          $map: {
            input: "$addOns",
            as: "product",
            in: {
              _id: "$$product._id",
              sku: "$$product.sku",
              urlParameter: "$$product.urlParameter",
              title: "$$product.title",
              thumbnails: "$$product.thumbnails",
              isSale: "$$product.isSale",
              isSubscription: "$$product.isSubscription",
              isMultiDiscount: "$$product.isMultiDiscount",
              sale: "$$product.sale",
              subscriptionSale: "$$product.subscriptionSale",
              multiDiscountQuantity: "$$product.multiDiscountQuantity",
              multiDiscountAmount: "$$product.multiDiscountAmount",
              unitPrices: {
                $map: {
                  input: "$$product.unitPrices",
                  as: "unitPrice",
                  in: {
                    unit: "$$unitPrice.unit",
                    price: "$$unitPrice.price",
                    salePrice: {
                      $cond: {
                        if: "$$product.isSale",
                        then: {
                          $round: [
                            {
                              $subtract: [
                                "$$unitPrice.price",
                                {
                                  $multiply: [
                                    "$$unitPrice.price",
                                    { $divide: ["$$product.sale", 100] },
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
                        if: "$$product.isSubscription",
                        then: {
                          $round: [
                            {
                              $subtract: [
                                "$$unitPrice.price",
                                {
                                  $multiply: [
                                    "$$unitPrice.price",
                                    {
                                      $divide: [
                                        "$$product.subscriptionSale",
                                        100,
                                      ],
                                    },
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
        },
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

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: productSearchableFields.map((field) => ({
        [field]: {
          $regex: escapeRegex(searchTerm),
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
      attribute: (value) => {
        const attributes = value.split(",");
        return {
          attribute: {
            $in: attributes,
          },
        };
      },
      productType: (value) => {
        const productTypes = value.split(",");
        return {
          productType: {
            $in: productTypes,
          },
        };
      },
      teaFormat: (value) => {
        const teaFormats = value.split(",");
        return {
          teaFormat: {
            $in: teaFormats,
          },
        };
      },
      teaFlavor: (value) => {
        const teaFlavors = value.split(",");
        return {
          teaFlavor: {
            $in: teaFlavors,
          },
        };
      },
      teaIngredient: (value) => {
        const teaIngredients = value.split(",");
        return {
          teaIngredient: {
            $in: teaIngredients,
          },
        };
      },
      teaBenefit: (value) => {
        const teaBenefits = value.split(",");
        return {
          teaBenefit: {
            $in: teaBenefits,
          },
        };
      },
      origin: (value) => {
        const countries = value.split(",");
        return {
          origin: {
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
      isStock: (value) => {
        return {
          isStock: {
            $in: [value === "true"],
          },
        };
      },
      isNewProduct: (value) => {
        return {
          isNewProduct: {
            $in: [value === "true"],
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
      isSubscription: (value) => {
        return {
          isSubscription: {
            $in: [value === "true"],
          },
        };
      },
      isMultiDiscount: (value) => {
        return {
          isMultiDiscount: {
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

  const whereConditions =
    andCondition.length > 0
      ? { $and: [...andCondition, { isPublished: true }] }
      : { isPublished: true };

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
      $lookup: {
        from: "media",
        localField: "thumbnails",
        foreignField: "_id",
        as: "thumbnails",
      },
    },
    {
      $lookup: {
        from: "media",
        localField: "slideImages",
        foreignField: "_id",
        as: "slideImages",
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
  getRelatedProductList,
  getProduct,
  getProductList,
};
