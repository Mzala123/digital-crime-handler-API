var mongoose = require('mongoose')
var nodemailer = require('nodemailer')


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
           if(!req.body.from || !req.body.to || !req.body.text){
               sendJSONresponse(res, 400, {"message":"Fill in the required field"});
           }  

           console.log(req.body.from)
           
           let  mailOptions = {
               from: req.body.from,
               to: req.body.to,
               subject: req.body.subject,
               text: req.body.text
           }
     transporter.sendMail(mailOptions, function(err, data){
              if(err){
                  sendJSONresponse(res, 404, err)
              }else if(data){
                  sendJSONresponse(res, 201, {"message":"email sent successfully", 'info':data})
              }
      })

}

