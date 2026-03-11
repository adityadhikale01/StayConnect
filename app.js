import express from 'express';
import mongoose from 'mongoose';
import Listing from './models/listings.js';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import Review from './models/reviews.js';
import WrapAsync from './utils/WrapAsync.js';
import {ExpressError} from './utils/Expresserror.js';

app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = "mongodb://127.0.0.1:27017/StayConnect";

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, 'images')));

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

/*  MIDDLWARE FOR ERROR HANDLING */
app.use((err, req, res, next) => {
    const { statusCode = 500 ,message= "Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', {message });
});



app.get('/listings',WrapAsync(async (req, res) => {
        
        const allListings = await Listing.find({});
        
        res.render('listings/index.ejs', { layout: 'layouts/boilerplate', allListings });
})
    
);

app.get("/listings/new",(req, res) => {
    console.log("Rendering new listing form");
    res.render("listings/new.ejs", { layout: 'layouts/boilerplate' });
});

app.get("/listings/:id",WrapAsync(async (req, res) => {
    
        const { id } = req.params;
        
        // populate reviews so we can render them
        const show_listing = await Listing.findById(id).populate('reviews');
      
        if (show_listing) {
            res.render("listings/show.ejs", { layout: 'layouts/boilerplate', show_listing });
        } else {
           throw new Error("Listing not found");
        }
      
    })
  );


app.post("/listings",WrapAsync( async (req, res) => {
  const {title, description, price, location, country} = req.body;
 
    const newListing = new Listing({ title, description, price, location, country });
    await newListing.save();
    res.redirect("/listings");
  
  
})
);

app.delete("/listings/:id",WrapAsync(async (req, res) => {
  const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
 
  
})
);

app.get("/listings/:id/edit" ,WrapAsync(async (req,res)=>{
 
        const { id } = req.params;
        
        const edit_listing = await Listing.findById(id);
      
        if (edit_listing) {
            res.render("listings/edit.ejs", { layout: 'layouts/boilerplate', edit_listing });
        } else {
           throw new Error("Listing not found");
        }
      
}));

app.put("/listings/:id",WrapAsync( async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;

    await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
    res.redirect(`/listings/${id}`);
  
}));

app.post("/listings/:id/reviews", WrapAsync(async (req, res) => {
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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
} );