var express = require("express");
var router  = express.Router({mergeParams: true}); //Merge the params in the middle of http request
var Gym = require("../models/gym");
var Comment = require("../models/comment");
var middleware = require("../middleware");

 //Comments New
 router.get("/new", middleware.isLoggedIn, function(req, res){
    // find gym by id
    Gym.findById(req.params.id, function(err, gym){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {gym: gym});
        }
    })
});

//Comments Create
router.post("/", middleware.isLoggedIn,function(req, res){
   //lookup gym using ID
   Gym.findById(req.params.id, function(err, gym){
       if(err){
           console.log(err);
           res.redirect("/gyms");
       } else {
        Comment.create(req.body.comment, function(err, comment){ //create new comment
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save(); //save comment
               gym.comments.push(comment); //connect new comment to gym
               gym.save();
               req.flash("success", "Successfully added comment");
               res.redirect("/gyms/" + gym._id); //redirect gym show page
           }
        });
       }
   });
});

// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Gym.findById(req.params.id, function(err, foundGym){
        console.log(err)
        if(err || !foundGym){
            req.flash("error", "Gym not found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit", {gym_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    console.log("receive")
    console.log(req.params.id)
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment Updated");
            res.redirect("/gyms/" + req.params.id);
        }
    })
})

//Comment Destory Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/gyms/" + req.params.id);
        }
    })
})

module.exports = router;