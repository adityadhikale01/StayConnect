import express from 'express';
const router= express.Router();
import WrapAsync from '../utils/WrapAsync.js';
import {ExpressError} from '../utils/Expresserror.js';
import Listing from '../models/listings.js';
import { listingSchema } from '../schema.js';
import {isLoggedIn} from '../middleware.js';
import { saveRedirectUrl } from '../middleware.js';

const validateListing = (req, res, next) => {
  
  let {error} = listingSchema.validate({ listing: req.body });
  if (error) {
    throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
  }
  next();
};
/* INDEX ROUTE */

router.get('/',WrapAsync(async (req, res) => {
        
        const allListings = await Listing.find({});
        
        res.render('listings/index.ejs', { layout: 'layouts/boilerplate', allListings });
})
    
);

/* NEW ROUTE */

router.get("/new",isLoggedIn,(req, res) => {
    console.log("Rendering new listing form");
    res.render("listings/new.ejs", { layout: 'layouts/boilerplate' });
});

/* SHOW ROUTE */

router.get("/:id",WrapAsync(async (req, res) => {
    
        const { id } = req.params;
        if(!id){
            throw new ExpressError("Invalid listing ID", 400);
        }
        // populate reviews so we can render them
        const show_listing = await Listing.findById(id).populate('reviews').populate('owner');
      
        if (show_listing) {
            res.render("listings/show.ejs", { layout: 'layouts/boilerplate', show_listing });
        } else {
           throw new ExpressError("Listing not found", 404);
        }
      
    })
  );

/* CREATE ROUTE */

router.post("/",isLoggedIn, validateListing, WrapAsync( async (req, res) => {
    const { title, description,image, price, location, country } = req.body;
    const newListing = new Listing({ title, description, image, price, location, country });
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect("/listings");
  
  
})
);

/* DELETE ROUTE */

router.delete("/:id",isLoggedIn,WrapAsync(async (req, res) => {
  const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect("/listings");
 
  
})
);

/* EDIT ROUTE */

router.get("/:id/edit",isLoggedIn ,WrapAsync(async (req,res)=>{
 
        const { id } = req.params;
        
        const edit_listing = await Listing.findById(id);
      
        if (edit_listing) {
            res.render("listings/edit.ejs", { layout: 'layouts/boilerplate', edit_listing });
        } else {
           throw new Error("Listing not found");
        }
      
}));
/* UPDATE ROUTE */

router.put("/:id", isLoggedIn,validateListing, WrapAsync( async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;

    await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
    res.redirect(`/listings/${id}`);
  
}));

export default router;