import express, { request } from 'express';
const router= express.Router({mergeParams: true});
import WrapAsync from '../utils/WrapAsync.js';
import {ExpressError} from '../utils/Expresserror.js';
import Review from '../models/reviews.js';
import Listing from '../models/listings.js';
import { reviewSchema } from '../schema.js';

// validation middleware for reviews
const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate({ review: req.body });
  if (error) {
    console.log("Validation error:", error);
    throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
  }
  next();
};


router.post("/", validateReview, WrapAsync(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  
    // make sure the listing actually exists
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new Error("Listing not found");
    }

    // create and persist the review first
    const newReview = new Review({ rating, comment });
    await newReview.save();
    
    // store just the ObjectId in the reviews array
    listing.reviews.push(newReview._id);
    await listing.save();
    res.redirect(`/listings/${id}`);
  
}));

/* DELETE REVIEW ROUTE */

router.delete("/:ReviewsId", WrapAsync(async (req, res) => {
  const { id } = req.params;
  const { ReviewsId } = req.params;
  console.log("Deleting review with ID:", ReviewsId, "for listing ID:", id);
  // make sure the listing actually exists
  const listing = await Listing.findById(id);
  console.log("Found listing:", listing);
  
  if (!listing) {
    throw new Error("Listing not found");
  }
  // remove the review reference from the listing's reviews array
  listing.reviews.pull(ReviewsId);
  await listing.save();
  console.log("Removed review reference from listing:", listing);
  // delete the review document itself
  await Review.findByIdAndDelete(ReviewsId);
  console.log("Deleted review document with ID:", ReviewsId);
  res.redirect("/listings/" + id);
}));

export default router;