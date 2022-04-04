var mongoose = require('mongoose')

var notificationSchema = new mongoose.Schema({
     from: {type: String, required: true},
     to: {type: String, required: true},
     subject: {type: String, required: true},
     text: {type: String, required: true},
     sentDate: {type: Date, 'default': Date.now},
     crimeId: {type: String, required: true}
})

mongoose.model('Notification', notificationSchema)