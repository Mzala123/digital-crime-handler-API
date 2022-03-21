const { request } = require("express")
const { send } = require("express/lib/response")
var mongoose = require("mongoose")
var Suspect = mongoose.model("Suspect")
var User = mongoose.model("User")

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}


module.exports.crimesCreate = function(req, res){
     var suspectId = req.params.suspectId
    // getRegisteringOfficer(req, res, function(req, res, username){
         if(suspectId){
             Suspect
               .findById(suspectId)
               .select('crimes')
               .exec(
                   function(err, suspect){
                       if(err){
                           sendJSONresponse(res, 404, err)
                       }else{
                           addCrime(req, res, suspect)
                       }
                   }
               )
         }else{
             sendJSONresponse(res, 404, {"message":"Not found suspect required"})
         }
    // })
}

var getRegisteringOfficer = function(req, res, callback){
     if(req.payload && req.payload.email){
         User
           .findOne({email : req.payload.email})
           .exec(function(err, user){
               if(!user){
                   sendJSONresponse(res, 404, {"message":"user not found okay"})
                   return
               }else if(err){
                   console.log(err)
                   sendJSONresponse(res, 404, err)
                   return
               }
               callback(req, res, user.name)
           })
     }else{
         sendJSONresponse(res, 404, {"message":"user not found munena"})
     }
} 


var addCrime = function(req, res, suspect){
    if(!suspect){
        sendJSONresponse(res, 404, {"message":"suspect not found"})
    }else{
        suspect.crimes.push({
            category: req.body.category,
            counts: req.body.counts,
            offenseDate: req.body.offenseDate,
            offenseDescription: req.body.offenseDescription,
            registeringOfficer: req.body.officer,
        })
        suspect.save(function(err, suspect){
            var thisCrime
            if(err){
                sendJSONresponse(res, 400, err)
            }else{
                thisCrime = suspect.crimes[suspect.crimes.length -1]
                sendJSONresponse(res, 201, thisCrime)
            }
        })
    }
}