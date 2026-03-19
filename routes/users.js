import express from 'express';
const router=express.Router();

import passport from 'passport';
import { saveRedirectUrl } from '../middleware.js';
import { loginForm, postLogin, postSignup, signupForm } from '../controllers/users.js';

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



export default router;
