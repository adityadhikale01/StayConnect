import express from 'express';
const router=express.Router();
import User from '../models/users.js';
import passport from 'passport';
import { isLoggedIn, saveRedirectUrl } from '../middleware.js';

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs", { layout: 'layouts/boilerplate' });
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if(err){
                next(err);
            }
        req.flash('success', 'Registration successful! Welcome To StayConnect.');
        res.redirect("/listings");
        });
    } catch (err) {
        
        if(err.name === 'UserExistsError') {
            req.flash('error', 'A user with the given username already exists. Please choose a different username.');
        }else if(err.name === 'MongoServerError' && err.code === 11000) {
            req.flash('error', 'A user with the given email already exists. Please choose a different email.');
        }else{
            req.flash('error', 'An error occurred during registration. Please try again.');
        }
        res.redirect("/users/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs", { layout: 'layouts/boilerplate' });

});

router.post("/login"
    ,saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: "/users/login",
         failureFlash: true
    }),
    (req, res) => {
        
         req.flash('success', 'Login successful!');
        
        const redirectToUrl=res.locals.redirectUrl||"/listings";
       
        res.redirect(redirectToUrl);
  }
);    

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
            req.flash('error', 'Logout failed. Please try again.');
            return res.redirect("/listings");
        }
        req.flash('success', 'You have been logged out successfully!');
        res.redirect("/users/login");
    });
});


export default router;
