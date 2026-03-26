import "dotenv/config";
console.log(process.env.MONGO_URL);
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import MongoStore from "connect-mongo";
import listings from './routes/listings.js';
import reviews from './routes/reviews.js';
import Users from './routes/users.js';
import flash from 'connect-flash';
import User from './models/users.js';
import  passport from 'passport';
import localStratagy from 'passport-local';




const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGOURL=process.env.MONGO_URL;
 
const sessionSecret =
  process.env.SESSION_SECRET ||
  process.env.MY_SECRET ||
  process.env.MY_SECREAT ||
  "change-this-development-secret";

if (!process.env.SESSION_SECRET && !process.env.MY_SECRET && !process.env.MY_SECREAT) {
  console.warn("SESSION_SECRET is not set in .env. Using a fallback secret for local development only.");
}
//const dburl=process.env.mongoUrl;

app.engine('ejs', ejsMate);

//mongo ssssesion store

const store=MongoStore.create({
  mongoUrl:MONGOURL,
  crypto:{
    secret:process.env.MY_SECREAT,
  },
  touchAfter:24*3600
});

store.on("error",()=>{
  console.log("ERROR DUE TO MONGO SESSION STORE",err);
});

// Session Options 
const sessionOptions = {
   // store:store,
    secret:sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week expiry date
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    
};
// Middleware to handle sessions
app.use(session(sessionOptions));

// Middleware to handle flash messages (temporary messages stored in the session)
app.use(flash());

// Initialize Passport and use it to manage user sessions
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport local strategy
passport.use(new localStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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
  await mongoose.connect(MONGOURL);
}


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    res.locals.searchFilters = {
        where: req.query.where || "",
        when: req.query.when || "",
        who: req.query.who || ""
    };
    next();
});

app.get("/",(req,res)=>{
  res.redirect("/listings");
});


// Routes for listings and reviews
app.use("/users", Users);
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
