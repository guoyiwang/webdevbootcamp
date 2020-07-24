var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root route
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//Show login form
router.get("/login", function(req, res){
    res.render("login");
});

//handing login logic
//passport.authenticate is middleware
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        // successFlash: "Welcome!",
        failureRedirect: "/login",
        // failureFlash: "Invalid username or password"
    }), function(req, res){
});

//logout 
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds")
});

module.exports = router;