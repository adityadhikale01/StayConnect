

const isLoggedIn=  (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.session.redirectUrl=req.originalUrl;
        //console.log(req.originalUrl);
        //console.log(req.session.redirectUrl);
        req.flash('error', 'You must be logged in to access this page.');
        res.redirect("/users/login");
        return;
    }
    
};

const saveRedirectUrl = (req, res, next) => {
    
    
    if(req.session.redirectUrl){
    
        res.locals.redirectUrl=req.session.redirectUrl;
        
        
    }
    next();
};

export {isLoggedIn,saveRedirectUrl};