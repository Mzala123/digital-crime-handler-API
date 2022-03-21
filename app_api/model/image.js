var mongoose = require("mongoose")

var imageSchema = mongoose.Schema({
    imagename:{type : String, 'default':'null_profile.png'},
    img:{
        data: Buffer,
        contentType: String
    } 
})

mongoose.model("Image", imageSchema)