var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middelware are here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        })
    }else{
        res.redirect("back");
    }
}

// middlewareObj.checkCommentOwnership = function(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id)
//     }
// }

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next(); 
    }
    res.redirect("/login");
}

module.exports = middlewareObj;