var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    });
});

//NEW - show form to create new campground
router.get("/new", function(req, res){
    res.render("campgrounds/new")
});

//CREATE - add new campground to DB
router.post("/", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//Show - shows more infor about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){//req.params.id is from get link
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});//pass the foundCampground which is found by the params id to show.ejs
        }
    }); 
});

module.exports = router;