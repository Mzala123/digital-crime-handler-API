const { request } = require("express")
var mongoose = require("mongoose")
var Suspect = mongoose.model("Suspect")

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}


module.exports.crimesCreate = function(req, res){
    
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
            registeringOfficer: req.body.registeringOfficer,
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