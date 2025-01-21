import httpStatus from "http-status";
import { productSearchableFields } from "../../constant/product.constant.js";
import ApiError from "../../error/ApiError.js";
import { PaginationHelpers } from "../../helper/paginationHelper.js";
import Product from "../../model/products.model.js";
import extractAlterText from "../../utils/extractAlterText.js";
import { removeImage } from "../../utils/fileSystem.js";

const getProduct = async (id) => {
  const result = await Product.findOne({ _id: id });

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "Product not found!");

  return result;
};

const getAllProductList = async () => {
  const result = await Product.find({});

  return result;
};

const getProductList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  // console.log(filtersData);
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

const deleteProduct = async (payload) => {
  const isExistProduct = await Product.findById(payload.id);

  if (!isExistProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not found");
  }

  const imagesToRemove = [
    ...(isExistProduct?.thumbnails || []),
    ...(isExistProduct?.slideImages || []),
  ];

  const result = await Product.findByIdAndDelete(payload.id);

  if (imagesToRemove.length > 0) {
    await Promise.all(
      imagesToRemove.map((element) => removeImage(element.uid))
    );
  }
  return result;
};

const addProduct = async (payload) => {
  const { thumbnails, slideImages, ...data } = payload;

  const product = {
    thumbnails: thumbnails.map((item) => ({
      alt: extractAlterText(item),
      uid: item,
      path: `/public/image/upload/${item}`,
    })),
    slideImages: slideImages.map((item) => ({
      alt: extractAlterText(item),
      uid: item,
      path: `/public/image/upload/${item}`,
    })),
    ...data,
  };

  const result = await Product.create(product);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

  return result;
};

export const ProductService = {
  getProduct,
  getAllProductList,
  getProductList,
  deleteProduct,
  addProduct,
};
