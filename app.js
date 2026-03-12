import express from 'express';
import mongoose from 'mongoose';
import Listing from './models/listings.js';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';

import {listingSchema} from './schema.js';

import listings from './routes/listings.js';
import reviews from './routes/reviews.js';

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

/*  VALIDATION MIDDLEWARE */
const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.map(d => d.message).join(', '), 400);
  }
  next();
};

/* ROUTES */

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);



/*  MIDDLWARE FOR ERROR HANDLING */
app.use((err, req, res, next) => {
    const { statusCode = 500 ,message= "Something went wrong!" } = err;
    res.status(statusCode).render('listings/error.ejs', {message });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
} );