var express = require("express");
var router  = express.Router();
var Gym = require("../models/gym");
var middleware = require("../middleware")

//INDEX - show all gyms
router.get("/", function(req, res){
    // Get all gyms from DB
    Gym.find({}, function(err, allGyms){
       if(err){
           console.log(err);
       } else {
          res.render("gyms/index",{gyms:allGyms});
       }
    });
});

//CREATE - add new gym to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to gyms array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGym = {name: name, price: price, image: image, description: desc, author: author}
    // Create a new gym and save to DB
    Gym.create(newGym, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to gyms page
            res.redirect("/gyms");
        }
    });
});

//NEW - show form to create new gym
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("gyms/new"); 
});

// SHOW - shows more info about one gym
router.get("/:id", function(req, res){
    //find the gym with provided ID
    Gym.findById(req.params.id).populate("comments").exec(function(err, foundGym){
        if(err || !foundGym){
            req.flash("error", "Gym not found");
            res.redirect("back");
        } else {
            console.log(foundGym)
            //render show template with that gym
            res.render("gyms/show", {gym: foundGym});
        }
    });
});

//EDIT Gym Route
router.get("/:id/edit", middleware.checkGymOwnership, function(req, res){
    Gym.findById(req.params.id, function(err, foundGym){
        res.render("gyms/edit", {gym: foundGym});
    });
});

//UPDATE Gym Route
router.put("/:id", middleware.checkGymOwnership, function(req, res){
    //find and update the correct gym
    Gym.findByIdAndUpdate(req.params.id, req.body.gym, function(err, updatedGym){
        if(err){
            res.redirect("/gyms");
        }else{
            res.redirect("/gyms/" + req.params.id);
        }
    });
});

//Destory Gym Route
router.delete("/:id", middleware.checkGymOwnership, function(req, res){
    Gym.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/gyms");
        }else{
            res.redirect("/gyms");
        }
    })
});

module.exports = router;