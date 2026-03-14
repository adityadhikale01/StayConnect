import express from 'express';
const router=express.Router();
import User from '../models/users.js';
import passport from 'passport';

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs", { layout: 'layouts/boilerplate' });
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect("/login");
    } catch (err) {
        console.error("Error during user registration:", err);
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect("/users/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs", { layout: 'layouts/boilerplate' });
});

router.post("/login", passport.authenticate('local', {
    
    failureRedirect: "/users/login",
    failureFlash: true,
    
    },
    async (req,res)=>{
        req.flash('success', 'Login successful!');
        res.redirect("/listings");
    }
));    



export default router;
