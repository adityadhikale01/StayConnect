import express from 'express';
const router= express.Router();
import WrapAsync from '../utils/WrapAsync.js';
import {isLoggedIn,isOwner,validateListing} from '../middleware.js';
import {index,createListingForm,show,postListing, deleteListing, editListingForm, updateListing} from '../controllers/listings.js'
import multer from 'multer';
import { storage } from '../cloudConfig.js';
const upload=multer({storage});

/* INDEX ROUTE */

router.route("/")
      .get(
      WrapAsync(index))
//Create Routes
      .post(
      isLoggedIn,
      upload.single("listing[image]"),
     
      validateListing,
      WrapAsync( postListing)

);

/* NEW ROUTE */

router.get("/new",
      isLoggedIn,
      createListingForm
);

/* SHOW ROUTE */

router.route("/:id")
      .get(
      WrapAsync(show) 
      )
      /* DELETE ROUTE */
      .delete(
      isLoggedIn,
      isOwner,
      WrapAsync(deleteListing)
      )
      /* UPDATE ROUTE */
      .put( isLoggedIn
            ,isOwner,
            upload.single("listing[image]"),
            validateListing,
            
            WrapAsync( updateListing));

      









/* EDIT ROUTE */

router.get("/:id/edit",
            isLoggedIn,
            isOwner,       
            WrapAsync(editListingForm)
      );


export default router;
