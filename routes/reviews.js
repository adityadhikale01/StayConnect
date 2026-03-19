import express from 'express';
const router= express.Router({mergeParams: true});
import WrapAsync from '../utils/WrapAsync.js';

import {isLoggedIn, isReviewAuthor,validateReview}  from '../middleware.js';
import { destroyReview, postReview } from '../controllers/reviews.js';




// CREATE REVIEW ROUTE
router.post("/",isLoggedIn, validateReview, WrapAsync(postReview));

/* DELETE REVIEW ROUTE */

router.delete("/:ReviewsId", isLoggedIn, isReviewAuthor, WrapAsync(destroyReview));

export default router;
