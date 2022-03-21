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

module.exports.crimesReadOne = function(req, res){
    if(req.params && req.params.suspectId && req.params.crimeId){
        Suspect
           .findById(req.params.suspectId)
           .select("name crimes")
           .exec(function(err, suspect){
               var response, crime;
               if(!suspect){
                   sendJSONresponse(res, 404, {"message":"suspect not found"})
                   retun
               }else if(err){
                 sendJSONresponse(res, 404, err)
               }if(suspect.crimes && suspect.crimes.length > 0){
                   crime = suspect.crimes.id(req.params.crimeId)
                   if(!crime){
                       sendJSONresponse(res, 404, {"message":"individual has no crime"})
                   }else{
                       response = {
                           suspect:{ 
                               firstname: suspect.firstname,
                               lastname: suspect.lastname,
                               id: req.params.suspectId
                           },
                           crime: crime
                       }

                       sendJSONresponse(res, 200, response)
                   }
               }else{
                   sendJSONresponse(res, 404, {"message":"no crime found"})
               }
           })
    }else{
        sendJSONresponse(res, 404, {"message":"not found, suspect id and crime id are both required"})
    }
}


module.exports.crimesUpdateOne = function(req, res){

}
module.exports.crimesDeleteOne = function(req, res){

}