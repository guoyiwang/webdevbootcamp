var mongoose = require("mongoose");
 
var gymSchema = new mongoose.Schema({
   name: {
      type: String,
      required: "RockClimbing GYM name cannot be blank."
   },
   price: String,
   image: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   slug: {
      type: String,
      unique: true
   }
});

// add a slug before the gym gets saved to the database
gymSchema.pre("save", async function(next){
   try{
      // check if a new gym is being saved, or if the gym name is being modified
      if(this.isNew || this.isModified("name")){
         this.slug = await generateUniqueSlug(this._id, this.name);
      }
      next();
   }catch(err){
      next(err);
   }
})
 
var Gym = mongoose.model("Gym", gymSchema);

module.exports = Gym;

async function generateUniqueSlug(id, gymName, slug) {
   try {
       // generate the initial slug
       if (!slug) {
           slug = slugify(gymName);
       }
       // check if a gym with the slug already exists
       var gym = await Gym.findOne({slug: slug});
       // check if a gym was found or if the found gym is the current gym
       if (!gym || gym._id.equals(id)) {
           return slug;
       }
       // if not unique, generate a new slug
       var newSlug = slugify(gymName);
       // check again by calling the function recursively
       return await generateUniqueSlug(id, gymName, newSlug);
   } catch (err) {
       throw new Error(err);
   }
}

function slugify(text) {
   var slug = text.toString().toLowerCase()
     .replace(/\s+/g, '-')        // Replace spaces with -
     .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
     .replace(/\-\-+/g, '-')      // Replace multiple - with single -
     .replace(/^-+/, '')          // Trim - from start of text
     .replace(/-+$/, '')          // Trim - from end of text
     .substring(0, 75);           // Trim at 75 characters
   return slug + "-" + Math.floor(1000 + Math.random() * 9000);  // Add 4 random digits to improve uniqueness
}