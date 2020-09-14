var mongoose = require("mongoose");
var Gym = require("./models/gym");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Triangle Rock Club - Durham", 
        price: "15",
        image: "https://cdn2.apstatic.com/photos/climb/117263804_medium_1561478061.jpg",
        description: "Triangle Rock Club began as a vision of two former Force Recon Marines who shared a passion for adventure and climbing. After the military and their mountaineering skills led them around the world and back again, Andrew and Luis began crafting a plan for a place where a community could be formed around a common passion for rock climbing",
        location: "1010 Martin Luther King Jr Pkwy #400, Durham, NC 27713, USA",
        lat:35.9514155,
        lng:-78.9243396,
        author:{
            id : "5f4f1c897d342f118fb585ac",
            username: "Guoyi"
        }
    },
    {
        name: "Triangle Rock Club - Fayetteville", 
        price: "15",
        image: "https://cdn2.apstatic.com/photos/climb/115378923_medium_1538423720.jpg",
        description: "In December 2007, visions and dreams were transformed into a reality when Triangle Rock Club opened the doors of its first location in Morrisville, North Carolina. In Fall 2014, the company opened a location in Fayetteville.",
        location: "5213 Raeford Rd #103, Fayetteville, NC 28304, USA",
        lat:35.0413016,
        lng:-78.9659719,
        author:{
            id : "5f4f1c897d342f118fb585ac",
            username: "Guoyi"
        }
    },
    {
        name: "Triangle Rock Club - Morrisville", 
        price: "15",
        image: "https://cdn2.apstatic.com/photos/climb/115361242_medium_1538056314.jpg",
        description: "In December 2007, visions and dreams were transformed into a reality when Triangle Rock Club opened the doors of its first location in Morrisville, North Carolina. As the company grew in leadership, so did its overall size. In 2013, Triangle Rock Club opened its facility in Morrisville’s 17,000 square foot.",
        location: "102 Pheasant Wood Ct, Morrisville, NC 27560, USA",
        lat:35.81124399999999,
        lng:-78.8207602,
        author:{
            id : "5f4f1c897d342f118fb585ac",
            username: "Guoyi"
        }
    },
    {
        name: "Progression Climbing",
        price: "13",
        image: "https://res.cloudinary.com/dqtwypf2t/image/upload/v1599169005/yaho5duqol2lpvzvjyfe.jpg",
        location: "1713 Legion Rd, Chapel Hill, NC 27517, USA",
        description: "At Progression, we are focused on developing programs to help climbers of all abilities have fun and achieve their personal climbing goals. We strive to develop a state-of-the-art indoor bouldering facility that promotes the pure movement and power of rock climbing.",
        lat: 35.9373234,
        lng: -79.0196971,
        author: {
            id: "5f4f1c897d342f118fb585ac",
            username: "Guoyi"
        }
    },
    {
        name: "Inner Peaks Matthews",
        price: "25",
        location: "47CV+6P Matthews, NC, USA",
        description: "With two state-of-the-art rock climbing facilities in the Charlotte area, Inner Peaks provides an environment that can help you stay fit, reduce stress, build focus, meet people and just have a great time. Ditch the traditional gym and come join us today!",
        lat: 35.1205625,
        lng: -80.7056875,
        image: "https://res.cloudinary.com/dqtwypf2t/image/upload/v1600051514/rwsh6k9qofffpjo5y1np.jpg",
        author: {
            id: "5f51b52c94201a7408fb8e39",
            username: "Annie"
        },
    },   
    {
        name: "The Ultimate Climbing Gym",
        price: "13",
        location: "33MC+5R Greensboro, NC, USA",
        description: "The Ultimate Climbing Gym at Ultimate Kids is a state-of-the-art rock climbing facility with 40 feet of “cutting edge” surfaces, as well as one of the largest bouldering areas in the Southeast. Our program is designed for ages 5 years through adult who want to experience the ultimate climbing fun and challenge.",
        lat: 36.0829375,
        lng: -79.9279375,
        image: "https://res.cloudinary.com/dqtwypf2t/image/upload/v1600051612/vh5ncemxou2d5upnavqh.jpg",
        author: {
            id: "5f51b52c94201a7408fb8e39",
            username: "Annie"
        },
    },
    {
        name: "Rock Solid Warrior",
        price: "15",
        location: "H6VV+5H Fuquay-Varina, NC, USA",
        description: "Family Friendly ninja warrior and rock climbing training, exploration, and competition for everyone from beginners to pros, 5 to 75.",
        lat: 35.5929375,
        lng: -78.7560625,
        image: "https://res.cloudinary.com/dqtwypf2t/image/upload/v1600051847/wbcotyxw6jah0jbx8yri.png",
        author: {
            id: "5f51b52c94201a7408fb8e39",
            username: "Annie"
        },
    },
    {
        name: "The Climbing Place",
        price: "15",
        location: "3438+32 Fayetteville, NC, USA",
        description: "Welcome to THE CLIMBING PLACE, Fayetteville’s premier indoor climbing and bouldering gym. Located in the heart of the historical down town district, The Climbing Place has something for just about everyone from beginners to the most experienced climbers. If you have always wanted to try indoor top rope climbing or bouldering this is the place for you, your friends, and family. ",
        lat: 35.0526875,
        lng: -78.88493749999999,
        image: "https://res.cloudinary.com/dqtwypf2t/image/upload/v1600052011/oya3loulrmhtvng5eqbe.png",
        author: {
            id: "5f51b52c94201a7408fb8e39",
            username: "Annie"
        },
    }
]
 
function seedDB(){
   //Remove all gyms
    Gym.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed gyms!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few gyms
            data.forEach(function(seed){
                Gym.create(seed, function(err, gym){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a gym");
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
                                    gym.comments.push(comment);
                                    gym.save();
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