import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import listings from './routes/listings.js';
import reviews from './routes/reviews.js';
import flash from 'connect-flash';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URL = "mongodb://127.0.0.1:27017/StayConnect";

app.engine('ejs', ejsMate);

// Session Options 
const sessionOptions = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week expiry date
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
// Middleware to handle sessions
app.use(session(sessionOptions));
// Middleware to override HTTP methods (e.g., for PUT and DELETE requests)
app.use(methodOverride('_method'));
// Middleware to parse incoming request bodies(form data for POST and PUT requests)
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine and specify the views directory
app.set('view engine', 'ejs');
// Set the directory for EJS templates
app.set("views", path.join(__dirname, "/views"));
// Serve static files from the 'public' directory and images from the 'images' directory
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

// Middleware to handle flash messages (temporary messages stored in the session)
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



// Routes for listings and reviews
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