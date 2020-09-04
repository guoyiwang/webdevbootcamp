var express = require("express");
var router  = express.Router();
var Gym = require("../models/gym");
var middleware = require("../middleware");
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

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API,
    formatter: null
};
var geocoder = NodeGeocoder(options);

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
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    geocoder.geocode(req.body.gym.location, function(err, data){
        if(err || !data.length){
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        console.log(req.body.gym.lat);
        req.body.gym.lat = data[0].latitude;
        req.body.gym.lng = data[0].longitude;
        req.body.gym.location = data[0].formattedAddress;
        cloudinary.v2.uploader.upload(req.file.path, function(err, result){
            if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            }
            // add cloudinary url for the image to the campground object under image property
            req.body.gym.image = result.secure_url;
            // add image's public_id to gym object
            req.body.gym.imageId = result.public_id;
            // add author to campground
            req.body.gym.author = {
                id: req.user._id,
                username: req.user.username
            }
            Gym.create(req.body.gym, function(err, gym){
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                res.redirect('/gyms/' + gym.id);
            });
        });
    }) 
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
router.put("/:id", middleware.checkGymOwnership, upload.single('image'), function(req, res){
    geocoder.geocode(req.body.gym.location, function(err, data){
        if(err||!data.length){
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        Gym.findById(req.params.id, async function(err, gym){
            if(err){
                req.flash('error', err.message);
                res.redirect("back");
            }else{
                console.log(gym);
                if(req.file){
                    try{
                        await cloudinary.v2.uploader.destroy(gym.imageId);
                        var result = await cloudinary.v2.uploader.upload(req.file.path);
                        gym.imageId = result.public_id;
                        gym.image = result.secure_url;
                    }catch(err){
                        req.flash('error', err.message);
                        return res.redirect("back");
                    }
                }
                gym.name = req.body.gym.name;
                gym.description = req.body.gym.description;
                gym.location = location;
                gym.lat = lat;
                gym.lng = lng;  
                gym.save();   
                res.redirect("/gyms/" + req.params.id);
            }
        });    

    })
    
});

//Destory Gym Route
router.delete("/:id", middleware.checkGymOwnership, function(req, res){
    Gym.findById(req.params.id, async function(err, gym){
        if(err){
            req.flash('error', ess.message);
            return res.redirect("back");
        }
        try{
            await cloudinary.v2.uploader.destroy(gym.imageId);
            gym.remove();
            req.flash('success', 'Gym deleted successfully!');
            res.redirect("/gyms");
        }catch(err){
            if(err){
                req.flash('error', err.message);
                return res.redirect('back');
            }
        }
    })
});

module.exports = router;