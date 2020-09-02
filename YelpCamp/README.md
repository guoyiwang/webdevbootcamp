# webdevbootcamp
Web development with Node.js and MongoDB

The different between GET and POST
GET could get the information in http through request params
POST is triggered when the form is submitted, the contend in form will be sent in request, then response a http 

RESTFUL ROUTES

name         url         verb     desc.
=======================================
INDEX  /campgrounds/index       GET      Display a list of all campgrounds
NEW    /campgrounds/new   GET      Display a form to make a new campground
CREATE /campgrounds       POST     Add a new campground to DB
SHOW   /campgrounds/:id   GET      Shows info about one campground
