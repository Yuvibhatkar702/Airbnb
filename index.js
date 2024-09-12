const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./moduls/Resister.js");
const methodOverride = require("method-override");
const ExpressError = require("./utils/expressErrors.js");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const path = require("path");
const Reviews = require("./moduls/Reviews.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingScheam,reviewSchema } = require("./Schema.js");
const { error } = require("console");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./moduls/user.js");
const LocalStartegy = require("passport-local");
const { isLoggedIn } = require("./middleware.js");
const { saveRedirectUrl } = require("./middleware.js")
const app = express();

app.set("view enginee", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); 

const sessionOption = {
    secret: "mynameisceo",
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + ( 7 * 24 * 60 * 60 * 1000 ),
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true   
    },
};

app.use(session(sessionOption));
app.use(flash());

//Auontication of User
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

    //connect to the session
passport.serializeUser(User.serializeUser());
    //Desconnect to the session
passport.deserializeUser(User.deserializeUser());

const dburl = process.env.ATLASDB_URL;
main().then(() => {
    console.log("Connected To the dataBase....");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/rent");
}

// app.get("/textListing", async (req,res) => {

//     let SampleList = new Listing({
//         title:"My Home",
//         description:"This is a Villaa Type Home",
//         image:"https://unsplash.com/photos/outdoor-lamps-turned-on-XbwHrt87mQ0",
//         price:120000,
//         location:"India",
//         Country:"India"
//     })

//     await SampleList.save();
//     console.log("Data is Save");
//     res.send("Successfull..");
// })


//middleWahre

const validateSchema = (req,res,next) => {
    let {error} = listingScheam.validate(req.body);
    
        if(error){
            throw new ExpressError(400, error);
        }else{
            next();
        }
}

const validateReview = (req,res,next) => {
    
    let {error} = reviewSchema.validate(req.body);
    console.log(error); 

    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

// flash Used
app.use((req,res,next) => {
    res.locals.success = req.flash("created");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})

// Require Controller 

const listingController = require("./Controller/Listing.js") 

//List - Home_Page
app.get("/Listings", async (req, res) => {
    let allList = await Listing.find({});
    res.render("Listing/List.ejs", { allList });
});

// Add_New
app.get("/Listing/new", isLoggedIn,  (req, res) => {
        res.render("Listing/addNewRecourd.ejs");
});

// add_new_listing
app.post("/Listing", async (req, res, next) => {
    try {
        let newListing = new Listing(req.body.Listing);
        await newListing.save();
        req.flash("created","New User Addedd...");
        res.redirect("/Listings");
    } catch (err) {
        next(err);
    }
});

//edit_Listing
app.get("/Listing/:id/edit", isLoggedIn , async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    req.flash("created", "Post edit Successfull..");
    res.render("Listing/edit.ejs", { data });
});

//show_list
app.get("/Listings/:id", async (req, res) => {
    let { id } = await req.params;
    let data = await Listing.findById(id);
    if(!Listing){
        req.flash("created", "Listing You access dose not exit");
        res.redirect("/Listings");
    }
    // console.log(data);
    res.render("Listing/show.ejs", { data });
});

//Update-list
app.put("/Listings/:id",  async (req, res) => {
    let { id } = await req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect("/Listings");
});

// Delete-From-Database
app.delete("/Listings/:id", async (req, res) => {
    let { id } = await req.params;
    const deleData = await Listing.findByIdAndDelete(id);
    req.flash("created","Post is deleted..");
    res.redirect("/Listings");
})


//demo resisterUser
app.get("/demoUser", async(req,res) => {
    let fakeUser = new User({
        email:"student@gmail.com",
        username:"yuvbhatkar702",
    });
    let r = await User.register(fakeUser, "hello World");
    res.send(r);
})

//SigeUp Students

app.get("/signup",  (req,res) => {
    res.render("users/signup.ejs");
})

app.post("/signup", async (req,res,next) => {
    let { username, email, password } = req.body;
    let newUser = new User({email,username});
    let paraUser = await User.register(newUser, password);

    // automaticaly Login user after SingUp
    req.login(paraUser, (err) => {
        if(err){
            return next(err);
        }
        req.flash("created", "Welcome to the House_renty");
        res.redirect("/Listings");
    })

})

//Login User

app.get("/login", (req,res) => {
    res.render("users/login.ejs");
})

app.post("/login", saveRedirectUrl ,  
    passport.authenticate("local", 
    {failureRedirect: "/login", 
    failureFlash: true }),
    async (req,res) => {
        req.flash("created", "User Login sucsessfully");
        let redirect = res.locals.ram || "/Listings";
        res.redirect(redirect); // render direct existing page
})

// LogOut User

app.get("/loggedOut", (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return err;
        }
        req.flash("created", "User LogOut Successfully");
        res.redirect("/Listings");
    })
})

// Reviews
app.post("/Listings/:id/Reviews", async (req,res) => {

    let list_id = await Listing.findById(req.params.id);

    let new_review = new Reviews(req.body.review);

    list_id.review.push(new_review);
 
    new_review.save();
    list_id.save();
   
    req.flash("created","Reviws set Succesfully");
    res.redirect("/Listings");
});

//custom error
app.all("*", (req,res,next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req,res,next) => {
    let {code=500, massage="Something is Not good"} = req.err;
    res.status(code).send(massage);
})

app.use((err, req, res, next) => { 
    res.send("some Things Wrong");
})

app.listen(8080, () => {
    console.log("app is lisning....");
});

