import httpStatus from "http-status";
import ApiError from "../../error/ApiError.js";
import { dateFormatter } from "../../helper/dateFormatter.js";
import Product from "../../model/products.model.js";
import User from "../../model/user.model.js";
import Review from "../../model/review.model.js";

const addReview = async (payload, userId) => {
  const { sku, ratingPoints, reviewText } = payload;

  // Get current date in UTC
  const { UTC } = dateFormatter.getDates();

  // Find user and product by userId and sku
  const user = await User.findOne({ userId });
  const product = await Product.findOne({ sku });

  // Check if user or product exists
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  if (!product) throw new ApiError(httpStatus.BAD_REQUEST, "Product not found!");

  // Create a new review
  const review = await new Review({
    user: user._id,
    product: product._id,
    date: UTC,
    ratingPoints,
    reviewText,
  }).save();

  // Add the review ID to the product's reviews array
  product.reviews.push(review._id);

  // Recalculate the product's average rating
  const reviews = await Review.find({ product: product._id });
  const totalRatings = reviews.reduce((sum, r) => sum + r.ratingPoints, 0);
  const averageRating = totalRatings / reviews.length;

  // Update product's ratings and save
  product.ratings = averageRating;
  await product.save();

  return review;
};

export const ReviewService = {
  addReview,
};
