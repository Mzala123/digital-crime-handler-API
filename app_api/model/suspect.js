var mongoose = require('mongoose')

/*var notificationSchema = new mongoose.Schema({
     from: {type: String, required: true},
     to: {type: String, required: true},
     subject: {type: String, required: true},
     text: {type: String, required: true},
     sentDate: {type: Date, 'default': Date.now},
     crimeId: {type: String, required: true}
}) */

var crimeSchema = new mongoose.Schema({
     category: {type: String, required: true},
     chargeFiled: {type: String, "default": Date.now},
     counts: {type: Number, requrired: true},
     offenseDate: {type: Date, required: true},
     offenseDescription: {type: String, required: true},
     attachments: [String],
     status: {type: String, 'default': 'Pending'},
     statusDescription: {type: String, 'default':'newly lodged case'},
     registeringOfficer: {type: String, required: true}
})

var suspectSchema = new mongoose.Schema({
     nationalId: {type: String, required: true},
     firstname: {type: String, required: true},
     lastname: {type: String, required: true},
     middlename: {type: String},
     age: {type:Number, required: true},
     profile_photo: {type:String, 'default': 'null_profile.png'}, 
     city_origin: {type: String, 'default': 'N/A'},
     gender: {type: String, required: true},
     race: {type: String, 'default': 'N/A'},
     dob: {type: Date, required: true},
     height: {type: String, 'default': 'N/A'},
     weight: {type: String, 'default': 'N/A'},
     eye_color: {type: String, 'default': 'N/A'},
     hair_color: {type: String, 'default': 'N/A'},
     current_city: {type: String, 'default': 'N/A'},
     address: {type: String, 'default': 'N/A'},
     skin_tone: {type: String, 'default': 'N/A'},
     known_aliases: {type: String, 'default': 'N/A'},
     crimes: [crimeSchema]
})

mongoose.model("Suspect", suspectSchema)