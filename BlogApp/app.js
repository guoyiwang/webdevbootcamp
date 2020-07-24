var express = require("express");
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override");

mongoose.connect('mongodb://localhost:27017/blog_app', {//create a db which name is blog_app
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema); //create a table blog in db and a Blog as model

// Blog.create({
//     title: "Test Blog",
//     image: "https://cdn.mos.cms.futurecdn.net/JzqhuEDTRfCZKMKHUxPySB.jpg",
//     body: "Hello this is a blog post!"
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
    })
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var formData = req.body.blog;
    Blog.create(formData, function(err, newBlog){
        console.log(newBlog);
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            res.redirect("/");
        }else{
            res.render("show", {blog: blog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render("edit", {blog: blog});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
        if(err){
            console.log(err);
        } else {
          var showUrl = "/blogs/" + blog._id;
          res.redirect(showUrl);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }else{
            blog.remove();
            res.render("/blogs");
        }
    });
});

app.listen(3000, function(){
    console.log("Blog is Running!")
});