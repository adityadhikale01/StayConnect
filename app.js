import express from 'express';
import mongoose from 'mongoose';
import Listing from './models/listings.js';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';

app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = "mongodb://127.0.0.1:27017/StayConnect";

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, 'public')));

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
app.get('/listings', async (req, res) => {
    try {
        const allListings = await Listing.find({});
        
        res.render('listings/index.ejs', { layout: 'layouts/boilerplate', allListings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

app.get("/listings/new", (req, res) => {
  console.log("Rendering new listing form");
    res.render("listings/new.ejs", { layout: 'layouts/boilerplate' });
});

app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const show_listing = await Listing.findById(id);
      
        if (show_listing) {
            res.render("listings/show.ejs", { layout: 'layouts/boilerplate', show_listing });
        } else {
           throw new Error("Listing not found");
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch listing' });
      }
    });


app.post("/listings", async (req, res) => {
  const {title, description, price, location, country} = req.body;
  try {
    const newListing = new Listing({ title, description, price, location, country });
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
} );