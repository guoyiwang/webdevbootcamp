var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Gym = require("./models/gym");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    gymRoutes = require("./routes/gyms"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost:27017/rock_climbing", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to DB!"))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));

// set the view engine to ejs
app.set("view engine", "ejs");

// seedDB();

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Shh, it's a secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //User.authenticate() comes from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware function for all routes, all routes should check the currectUser
// req.user will be passed to all templates
// res.locals.currectUser will be availble for all tempates
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();//move on to the next accurate code
});

app.use("/", indexRoutes);
app.use("/gyms", gymRoutes);
app.use("/gyms/:id/comments", commentRoutes);
 
app.listen(3000, function(){
    console.log("The Rock Climbing Has Started!")
});