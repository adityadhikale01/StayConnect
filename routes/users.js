import express from 'express';
const router=express.Router();

import passport from 'passport';
import WrapAsync from '../utils/WrapAsync.js';
import { isLoggedIn, saveRedirectUrl } from '../middleware.js';
import {
    loginForm,
    postLogin,
    postSignup,
    profilePage,
    signupForm,
    toggleWishlist
} from '../controllers/users.js';

//get Signup Form//Post Singup data
router
    .route("/signup")
    .get( signupForm)
    .post( postSignup);
// get and post login data.
router.route("/login")
    .get((req,res)=>{
    res.render("users/login.ejs")
    })

    .post(
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: "/users/login",
         failureFlash: true
    }),
    loginForm
);    
router.get("/logout", postLogin);
router.get("/profile", isLoggedIn, WrapAsync(profilePage));
router.post("/wishlist/:listingId", isLoggedIn, WrapAsync(toggleWishlist));



export default router;
