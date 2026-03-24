import Listing from '../models/listings.js';
import {ExpressError} from '../utils/Expresserror.js';
import {v2 as cloudinary} from 'cloudinary';
import axios from 'axios';

const DEFAULT_IMAGE = {
    url: "/images/listing_1_.jpg",
    filename: "listing[image]"
};
//Index Route logic
const index=async (req, res) => {
        
        const allListings = await Listing.find({});
        
        res.render('listings/index.ejs', { layout: 'layouts/boilerplate', allListings });
}

const createListingForm=(req, res) => {
    console.log("Rendering new listing form");
    res.render("listings/new.ejs", { layout: 'layouts/boilerplate' });
}

const  show=async (req, res) => {
    
        const { id } = req.params;
        if(!id){
            throw new ExpressError("Invalid listing ID", 400);
        }
        // populate reviews so we can render them
        const show_listing = await Listing.findById(id)
        .populate({
          path:'reviews',
          populate:{path:'author'}
          
        })
        .populate('owner');
      
        if (show_listing) {
            res.render("listings/show.ejs", { layout: 'layouts/boilerplate', show_listing });
        } else {
           throw new ExpressError("Listing not found", 404);
        }
      
    }

const postListing=async (req, res) => {
    const { title, description, price, location, country } = req.body.listing;
    const newListing = new Listing({ title, description, price, location, country });
    newListing.owner = req.user._id;
    

    if (!location || !country) {
        return res.status(400).json({ error: 'Location and country required' });
    }
      // You can use  
      const address=location;
    console.log("reached here");
      const response = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
      params: {
        q: address,
        key: process.env.OPENCAGE_KEY, // keep your key in .env
        limit: 1
      }
      });
      const data = response.data.results[0];
      console.log(data);
        if (data.length === 0) {
            return res.status(404).json({ error: 'Coordinates not found' });
        }

        const { lat, lon } = data;
        console.log(lat,lon);
        newListing.coordinates.latitude=lat;
        newListing.coordinates.longitude=lon;

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        newListing.image = { url, filename };
    } else {
        newListing.image = DEFAULT_IMAGE;
    }

    await newListing.save();
    req.flash('success', 'Listing created successfully!');
    res.redirect("/listings");
}

const deleteListing=async (req, res) => {
    const { id } = req.params;
    let listing= await Listing.findById(id);
    console.log(listing);
    let publicId=listing.image.filename;
   
    const result = await cloudinary.uploader.destroy(publicId);
    
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect("/listings");
 
  
}
const editListingForm =async (req,res)=>{

        const { id } = req.params;
        
        const edit_listing = await Listing.findById(id);
      
        if (edit_listing) {
            res.render("listings/edit.ejs", { layout: 'layouts/boilerplate', edit_listing });
        } else {
           throw new ExpressError("Listing not found", 404);
        }
      
}

const updateListing=async (req, res) => {
    
    const { id } = req.params;
    const { title, description, price, location, country } = req.body.listing || req.body;
     
    const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { title, description, price, location, country },
    { runValidators: true, new: true }
  );

  if (!updatedListing) {
    throw new ExpressError("Listing not found", 404);
  }
  if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        let publicId=updatedListing.image.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
        await cloudinary.uploader.destroy(publicId);
        
    } else {
        updatedListing.image = DEFAULT_IMAGE;
    }
    
   
  res.redirect(`/listings/${id}`);
  
}
export {index,createListingForm,show,postListing,deleteListing,editListingForm,updateListing};
