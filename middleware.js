import Listing from './models/listings.js';
import Review from './models/reviews.js';
import {ExpressError} from './utils/Expresserror.js';
import { reviewSchema } from './schema.js';
import { listingSchema } from './schema.js';

const isLoggedIn=  (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.session.redirectUrl=req.originalUrl;
        //console.log(req.originalUrl);
        //console.log(req.session.redirectUrl);
        req.flash('error', 'You must be logged in to access this page.');
        res.redirect("/users/login");
        return;
    }
    
};

const saveRedirectUrl = (req, res, next) => {
    
    
    if(req.session.redirectUrl){
    
        res.locals.redirectUrl=req.session.redirectUrl;
        
        
    }
    next();
};
//middleware for listing owner cheaking for giveing him functionality to update and delete listing
const isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listings");
    }

    if(!listing.owner){
        req.flash("error","This listing does not have an owner assigned.");
        return res.redirect(`/listings/${id}`);
    }

    if(!req.user || !listing.owner.equals(req.user._id)){
        req.flash("error","You are not the Owner of Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    let { id, ReviewsId } = req.params;
    let review = await Review.findById(ReviewsId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author) {
        req.flash("error", "This review does not have an author assigned.");
        return res.redirect(`/listings/${id}`);
    }

    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
}
    
const validateListing = (req, res, next) => {
  const listingPayload = req.body?.listing ?? req.body;
  let {error} = listingSchema.validate({ listing: listingPayload });
  if (error) {
    
    throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
  }
  req.body.listing = listingPayload;
  next();
};
// validation middleware for reviews
const validateReview = (req, res, next) => {
  const reviewPayload = req.body?.review ?? req.body;
  let {error} = reviewSchema.validate({ review: reviewPayload });
  if (error) {
    console.log("Validation error:", error);
    throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
  }
  req.body.review = reviewPayload;
  next();
};

export {isLoggedIn,saveRedirectUrl,isOwner,isReviewAuthor,validateReview,validateListing};
