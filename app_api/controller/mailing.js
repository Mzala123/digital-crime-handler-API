const { json } = require('express/lib/response')
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var Notification = mongoose.model('Notification')
var Suspect = mongoose.model('Suspect')

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})

module.exports.send_nofification_email_to_suspect = function(req, res){
           if(!req.body.from || !req.body.to || !req.body.text || !req.body.crimeId){
               sendJSONresponse(res, 400, {"message":"Fill in the required field"});
           }  

           let  mailOptions = {
               from: req.body.from,
               to: req.body.to,
               subject: req.body.subject,
               text: req.body.text,
           }
           
           var notification = new Notification()
           notification.from = req.body.from
           notification.to = req.body.to
           notification.subject = req.body.subject,
           notification.text = req.body.text,
           notification.crimeId = req.body.crimeId

           notification.save(function(err){
            if(err){
               console.log("There was an issue" +err)
            }else{
               console.log('Email notifications details save')
            }
           })

           transporter.sendMail(mailOptions, function(err, data){
                    if(err){
                        sendJSONresponse(res, 404, err)
                    }else if(data){
                        sendJSONresponse(res, 201, {"message":"email sent successfully", 'info':data})
                    }
            })

}

module.exports.read_nofification_email_details = function(req, res){
       const ObjectId = mongoose.Types.ObjectId;
       var suspectId = req.query.suspectId
       suspectId === Suspect._id
       console.log(suspectId);
       Suspect
         .aggregate(
             [
                 {$match: { _id: ObjectId(suspectId)}},
                 {$unwind: "$crimes"},
                 {
                     $lookup: {
                        from: 'notifications',
                        localField: "crimes._id",
                        foreignField: "crimeId",
                        as: "crimeDocs"
                     }
                 } 
             ]
         ).exec(function(err, data){
             if(err){

             }else{
                 sendJSONresponse(res, 200, data)
             }
         })
}

