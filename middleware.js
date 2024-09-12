module.exports.isLoggedIn = (req,res,next) => {

    if(req.isAuthenticated()){
        res.render("Listing/addNewRecourd.ejs");
    }else{
        
        req.session.Url = req.originalUrl; // after login user come to particular Page
        console.log(req.session.Url);
        req.flash("error","Please login your Account");
        res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.Url){
        res.locals.ram = req.session.Url;
    } 
    next();
}