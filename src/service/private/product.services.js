import httpStatus from 'http-status';
import mongoose from 'mongoose';
import {
  mediaLookupPipeline,
  mediaUnset,
  productSearchableFields,
} from '../../constant/product.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Product from '../../model/products.model.js';
import escapeRegex from '../../utils/escapeRegex.js';

const { ObjectId } = mongoose.Types;

const editProduct = async payload => {
  const { id, ...data } = payload;

  const existingProduct = await Product.findById(id);

  if (!existingProduct)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found!');

  const result = await Product.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });

  return result;
};

const getProduct = async id => {
  const pipeline = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $group: {
        _id: '$_id',
        urlParameter: { $first: '$urlParameter' },
        sku: { $first: '$sku' },
        title: { $first: '$title' },
        longDescription: { $first: '$longDescription' },
        shortDescription: { $first: '$shortDescription' },
        metaTitle: { $first: '$metaTitle' },
        metaDescription: { $first: '$metaDescription' },
        thumbnails: { $first: '$thumbnails' },
        slideImages: { $first: '$slideImages' },
        category: { $first: '$category' },
        attribute: { $first: '$attribute' },
        productType: { $first: '$productType' },
        teaFormat: { $first: '$teaFormat' },
        teaFlavor: { $first: '$teaFlavor' },
        teaIngredient: { $first: '$teaIngredient' },
        teaBenefit: { $first: '$teaBenefit' },
        origin: { $first: '$origin' },
        originLocation: { $first: '$originLocation' },
        youtubeLink: { $first: '$youtubeLink' },
        isPublished: { $first: '$isPublished' },
        isStock: { $first: '$isStock' },
        isNewProduct: { $first: '$isNewProduct' },
        isBestSeller: { $first: '$isBestSeller' },
        isFeatured: { $first: '$isFeatured' },
        isSale: { $first: '$isSale' },
        isSubscription: { $first: '$isSubscription' },
        isMultiDiscount: { $first: '$isMultiDiscount' },
        sale: { $first: '$sale' },
        subscriptionSale: { $first: '$subscriptionSale' },
        multiDiscountQuantity: { $first: '$multiDiscountQuantity' },
        multiDiscountAmount: { $first: '$multiDiscountAmount' },
        unitPrices: { $first: '$unitPrices' },
        subscriptions: { $first: '$subscriptions' },
        availableAs: { $first: '$availableAs' },
        addOns: { $first: '$addOns' },
        brewInstruction: { $first: '$brewInstruction' },
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'thumbnails',
        foreignField: '_id',
        as: 'thumbnails',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'slideImages',
        foreignField: '_id',
        as: 'slideImages',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'availableAs',
        foreignField: '_id',
        as: 'availableAs',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'addOns',
        foreignField: '_id',
        as: 'addOns',
      },
    },
    {
      $lookup: {
        from: 'brewinstructions',
        localField: 'brewInstruction',
        foreignField: '_id',
        as: 'brewInstruction',
      },
    },
    {
      $addFields: {
        availableAs: {
          $map: {
            input: '$availableAs',
            as: 'product',
            in: {
              title: '$$product.title',
              thumbnails: '$$product.thumbnails',
              _id: '$$product._id',
            },
          },
        },
        addOns: {
          $map: {
            input: '$addOns',
            as: 'product',
            in: {
              title: '$$product.title',
              thumbnails: '$$product.thumbnails',
              _id: '$$product._id',
            },
          },
        },
        brewInstruction: {
          $map: {
            input: '$brewInstruction',
            as: 'brewinstructions',
            in: {
              title: '$$brewinstructions.title',
              _id: '$$brewinstructions._id',
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
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found!');
  }

  return result[0];
};

const getAllProductList = async () => {
  const result = await Product.find({});

  return result;
};

const getProductList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: productSearchableFields.map(field => ({
        [field]: {
          $regex: escapeRegex(searchTerm),
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const splitter = val => val.split(',').map(x => x.toLowerCase().trim());

    const filterHandlers = {
      category: val => ({
        'category.assortment': { $in: splitter(val) },
      }),
      attribute: val => ({
        'attribute.assortment': { $in: splitter(val) },
      }),
      productType: val => ({
        'productType.assortment': { $in: splitter(val) },
      }),
      teaFormat: val => ({
        'teaFormat.assortment': { $in: splitter(val) },
      }),
      teaFlavor: val => ({
        'teaFlavor.assortment': { $in: splitter(val) },
      }),
      teaIngredient: val => ({
        'teaIngredient.assortment': { $in: splitter(val) },
      }),
      teaBenefit: val => ({
        'teaBenefit.assortment': { $in: splitter(val) },
      }),
      origin: val => ({ origin: { $in: splitter(val) } }),
      isPublished: val => ({ isPublished: { $in: [val === 'true'] } }),
      isStock: val => ({ isStock: { $in: [val === 'true'] } }),
      isNewProduct: val => ({ isNewProduct: { $in: [val === 'true'] } }),
      isBestSeller: val => ({ isBestSeller: { $in: [val === 'true'] } }),
      isFeatured: val => ({ isFeatured: { $in: [val === 'true'] } }),
      isSale: val => ({ isSale: { $in: [val === 'true'] } }),
      isSubscription: val => ({
        isSubscription: { $in: [val === 'true'] },
      }),
      isMultiDiscount: val => ({
        isMultiDiscount: { $in: [val === 'true'] },
      }),
      default: (field, val) => ({
        [field]: val,
      }),
    };

    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => {
          const handler = filterHandlers[field] || filterHandlers.default;
          return handler(field === 'default' ? [field, value] : value);
        }),
      });
    }
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const sortConditions = {};

  if (sortBy && sortOrder) {
    if (sortBy === 'price') {
      sortConditions['unitPrices.0.price'] = sortOrder;
    } else {
      sortConditions[sortBy] = sortOrder;
    }
  }

  const pipelines = [
    {
      $lookup: {
        from: 'media',
        localField: 'thumbnails',
        foreignField: '_id',
        as: 'thumbnails',
        pipeline: [mediaUnset],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'slideImages',
        foreignField: '_id',
        as: 'slideImages',
        pipeline: [mediaUnset],
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'category',
        foreignField: '_id',
        as: 'category',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'attribute',
        foreignField: '_id',
        as: 'attribute',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'productType',
        foreignField: '_id',
        as: 'productType',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'teaFormat',
        foreignField: '_id',
        as: 'teaFormat',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'teaFlavor',
        foreignField: '_id',
        as: 'teaFlavor',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'teaIngredient',
        foreignField: '_id',
        as: 'teaIngredient',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $lookup: {
        from: 'assortments',
        localField: 'teaBenefit',
        foreignField: '_id',
        as: 'teaBenefit',
        pipeline: mediaLookupPipeline,
      },
    },
    {
      $addFields: {
        unitPrices: {
          $map: {
            input: '$unitPrices',
            as: 'unitPrice',
            in: {
              unit: '$$unitPrice.unit',
              price: '$$unitPrice.price',
              salePrice: {
                $cond: {
                  if: '$isSale',
                  then: {
                    $round: [
                      {
                        $subtract: [
                          '$$unitPrice.price',
                          {
                            $multiply: [
                              '$$unitPrice.price',
                              { $divide: ['$sale', 100] },
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
                  if: { $and: ['$isSubscription'] },
                  then: {
                    $round: [
                      {
                        $subtract: [
                          '$$unitPrice.price',
                          {
                            $multiply: [
                              '$$unitPrice.price',
                              { $divide: ['$subscriptionSale', 100] },
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

const deleteProducts = async ids => {
  const products = await Product.find({ _id: { $in: ids } });

  if (!products.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Products not found');
  }

  // Delete products
  const result = await Product.deleteMany({ _id: { $in: ids } });

  return result;
};

const deleteProduct = async id => {
  const isExistProduct = await Product.findById(id);

  if (!isExistProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  const result = await Product.findByIdAndDelete(id);

  return result;
};

const addProduct = async payload => {
  const result = await Product.create(payload);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

export const ProductService = {
  deleteProducts,
  editProduct,
  getProduct,
  getAllProductList,
  getProductList,
  deleteProduct,
  addProduct,
};
