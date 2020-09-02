var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Triangle Rock Club - Durham", 
        price: "15",
        image: "https://cdn2.apstatic.com/photos/climb/117263804_medium_1561478061.jpg",
        description: "Triangle Rock Club began as a vision of two former Force Recon Marines who shared a passion for adventure and climbing. After the military and their mountaineering skills led them around the world and back again, Andrew and Luis began crafting a plan for a place where a community could be formed around a common passion for rock climbing",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Triangle Rock Club - Fayetteville", 
        price: "15",
        image: "https://cdn2.apstatic.com/photos/climb/115378923_medium_1538423720.jpg",
        description: "In December 2007, visions and dreams were transformed into a reality when Triangle Rock Club opened the doors of its first location in Morrisville, North Carolina. In Fall 2014, the company opened a location in Fayetteville.",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Triangle Rock Club - Morrisville", 
        price: "15",
        image: "https://cdn2.apstatic.com/photos/climb/115361242_medium_1538056314.jpg",
        description: "In December 2007, visions and dreams were transformed into a reality when Triangle Rock Club opened the doors of its first location in Morrisville, North Carolina. As the company grew in leadership, so did its overall size. In 2013, Triangle Rock Club opened its facility in Morrisville’s 17,000 square foot.",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author:{
                                    id : "588c2e092403d111454fff76",
                                    username: "Jack"
                                }
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;