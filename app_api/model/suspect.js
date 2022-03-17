var mongoose = require('mongoose')

var suspectSchema = new mongoose.Schema({
     nationalId: {type: String, required: true},
     firstname: {type: String, required: true},
     lastname: {type: String, required: true},
     middlename: {type: String},
     age: {type:Number, required: true},
     profile_photo: {type:String, 'default': 'null_profile.png'}, 
     city_origin: {type: String},
     gender: {type: String, required: true},
     race: {type: String},
     dob: {type: Date, required: true},
     height: {type: String, 'default':null},
     weight: {type: String, 'default':null},
     eye_color: {type: String, 'default': null},
     hair_color: {type: String, 'default': null},
     current_city: {type: String, 'default': null},
     address: {type: String, 'default': null},
     skin_tone: {type: String, 'default': null},
     known_aliases: {type: String, 'default': null}
})

mongoose.model("Suspect", suspectSchema)