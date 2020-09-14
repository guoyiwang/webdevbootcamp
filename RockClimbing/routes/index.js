var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Gym = require("../models/gym");

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, Date.now() + file.originalname);
    }
})
var imageFiler = function(req, file, cb){
    //accept image files only
    if(!file.originalname.match(/\.(jpg|jpeg|png|git)$/i)){
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({storage: storage, fileFilter: imageFiler});

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dqtwypf2t', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", upload.single('image'), function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        // avatar: req.body.avatar
      });
    if(req.body.adminCode === 'secretcode123') {
      newUser.isAdmin = true;
    }
    cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if(err){
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // add cloudinary url for the image to the campground object under image property
        newUser.profile = result.secure_url;
        // add image's public_id to gym object
        newUser.profileId = result.public_id;
        User.register(newUser, req.body.password, function(err, user){
            if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            }
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
                res.redirect("/gyms"); 
            });
        });
    });
});

// show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/gyms",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/gyms");
});

// SHOW USER PROFILE
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      Gym.find().where('author.id').equals(foundUser._id).exec(function(err, gyms) {
        if(err) {
          req.flash("error", "Something went wrong.");
          res.redirect("/");
        }
        res.render("users/show", {user: foundUser, gyms: gyms});
      })
    });
});

// UPDATE USER PROFILE
router.put("/users/:id", upload.single('image'), function(req, res){
    if(req.isAuthenticated()){
        if(req.params.id.str === req.user._id.str||req.user.isAdmin){
            console.log(req.params.id)
            console.log(req.user._id)
            User.findById(req.params.id, async function(err, user){
                if(err){
                    req.flash('error', err.message);
                    res.redirect("back");
                }else{
                    console.log(user);
                    if(req.file){
                        try{
                            if(!user.profileId){
                                var result = await cloudinary.v2.uploader.upload(req.file.path);
                            }else{
                                await cloudinary.v2.uploader.destroy(user.profileId);
                                var result = await cloudinary.v2.uploader.upload(req.file.path);
                            }
                            user.profileId = result.public_id;
                            user.profile = result.secure_url;
                        }catch(err){
                            req.flash('error', err.message);
                            return res.redirect("back");
                        }
                    }
                    user.firstName = req.body.firstName;
                    user.lastName = req.body.lastName;
                    user.email = req.body.email;
                    user.save(); 
                    req.flash("success","Successfully Updated!");  
                    res.redirect("/users/" + req.params.id);
                }
            }); 

        }else{
            req.flash("error", "You can't edit other people's account");
            res.redirect("back");
        }
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
});

module.exports = router;