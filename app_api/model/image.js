var mongoose = require("mongoose")

var imageSchema = mongoose.Schema({
    name:{type : String},
    image_url: {type: String},
    cloudinary_id:{ type:String}
})

mongoose.model("Image", imageSchema)