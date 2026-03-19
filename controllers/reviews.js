import Review from '../models/reviews.js';
import Listing from '../models/listings.js';
import {ExpressError} from '../utils/Expresserror.js';
const postReview=async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body.review || req.body;
  
  
    // make sure the listing actually exists
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }

    // create and persist the review first
    const newReview = new Review({ rating, comment });
    newReview.author=req.user._id;
    await newReview.save();
    
    // store just the ObjectId in the reviews array
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${id}`);
  
}

const  destroyReview=async (req, res) => {
  const { id } = req.params;
  const { ReviewsId } = req.params;
  console.log("Deleting review with ID:", ReviewsId, "for listing ID:", id);
  // make sure the listing actually exists
  const listing = await Listing.findById(id);
  
  
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  // remove the review reference from the listing's reviews array
  listing.reviews.pull(ReviewsId);
  await listing.save();
  
  // delete the review document itself
  await Review.findByIdAndDelete(ReviewsId);
  req.flash('success', 'Review deleted successfully!');
  res.redirect("/listings/" + id);
}

export {postReview,destroyReview};
