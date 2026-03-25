import User from '../models/users.js';
import Listing from '../models/listings.js';

const signupForm=(req, res) => {
    res.render("users/signup.ejs", { layout: 'layouts/boilerplate' });
}

const postSignup =async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if(err){
                return next(err);
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
};

const loginForm=(req, res) => {
        
         req.flash('success', 'Login successful!');
        
        const redirectToUrl=res.locals.redirectUrl||"/listings";
        
       
        res.redirect(redirectToUrl);
  }

  const postLogin=(req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
            req.flash('error', 'Logout failed. Please try again.');
            return res.redirect("/listings");
        }
        req.flash('success', 'You have been logged out successfully!');
        res.redirect("/users/login");
    });
}

const profilePage = async (req, res) => {
    const userProfile = await User.findById(req.user._id).populate({
        path: "wishlist",
        populate: { path: "owner", select: "username" }
    });

    if (!userProfile) {
        req.flash("error", "Profile not found.");
        return res.redirect("/listings");
    }

    const ownListings = await Listing.find({ owner: req.user._id }).sort({ _id: -1 });
    const wishlistListings = (userProfile.wishlist || []).filter(Boolean);

    res.render("users/profile.ejs", {
        layout: "layouts/boilerplate",
        userProfile,
        ownListings,
        wishlistListings
    });
};

const toggleWishlist = async (req, res) => {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        req.flash("error", "User not found.");
        return res.redirect("/users/login");
    }
    user.wishlist = user.wishlist || [];
    const alreadyWishlisted = user.wishlist.some((id) => id.equals(listing._id));

    if (alreadyWishlisted) {
        user.wishlist.pull(listing._id);
        req.flash("success", "Removed from wishlist.");
    } else {
        user.wishlist.push(listing._id);
        req.flash("success", "Added to wishlist.");
    }

    await user.save();
    const redirectTo = req.get("referer") || "/listings";
    res.redirect(redirectTo);
};

export {signupForm,postSignup,loginForm,postLogin,profilePage,toggleWishlist};
