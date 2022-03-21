var mongoose = require("mongoose")
var Suspect = mongoose.model("Suspect")

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

module.exports.add_person_suspect = function(req, res){
    if(!req.body.nationalId || !req.body.firstname || !req.body.lastname 
        || !req.body.age || !req.body.gender || !req.body.dob){
            sendJSONresponse(res, 404, {"message":"Please fill in all required fields"})
            return
    }
    var suspect = new Suspect()
    suspect.nationalId = req.body.nationalId
    suspect.firstname = req.body.firstname
    suspect.lastname = req.body.lastname
    suspect.age = req.body.age
    suspect.gender = req.body.gender
    suspect.dob = req.body.dob
    suspect.middlename = req.body.middlename
    suspect.profile_photo = req.body.profile_photo
    suspect.city_origin = req.body.city_origin
    suspect.race = req.body.race
    suspect.height = req.body.height
    suspect.weight = req.body.weight
    suspect.eye_color = req.body.eye_color
    suspect.hair_color = req.body.hair_color
    suspect.current_city = req.body.current_city
    suspect.address = req.body.address
    suspect.skin_tone = req.body.skin_tone
    suspect.known_aliases = req.body.known_aliases

    suspect.save(function(err){
        if(err){
         sendJSONresponse(res, 404, err)
        }else{
          sendJSONresponse(res, 201, suspect)
        }
    })
}

module.exports.get_list_of_person_suspects = function(req, res){
      Suspect
       .find({})
       .exec(function(err, suspect){
           if(err){
             sendJSONresponse(res, 404, err)
           }else{
               console.log(suspect)
               sendJSONresponse(res, 200, suspect)
           }
       })
}

module.exports.read_one_person_suspect = function(req, res){
    if(!req.params.suspectId){
        sendJSONresponse(res, 404, {"message":"suspect id is required"});
    }else if(req.params && req.params.suspectId){
         Suspect
           .findById(req.params.suspectId)
           .exec(function(err, suspect){
               if(!suspect){
                sendJSONresponse(res, 404, {"message":"suspect not found"})
               }else if(err){
                   sendJSONresponse(res, 404, err)
               }else{
                   sendJSONresponse(res, 200, suspect)
               }
           })
    }
}

module.exports.update_person_suspect = function(req, res){
    if(!req.params.suspectId){
        sendJSONresponse(res, 404, {"message":"Not found, suspect id is required"})
        return 
    }
    Suspect
       .findById(req.params.suspectId)
       .exec(function(err, suspect){
           if(err){
               sendJSONresponse(res, 404, err)
           }else if(!suspect){
               sendJSONresponse(res, 404, {"message":"suspect id not found"})
           }else{
            suspect.nationalId = req.body.nationalId
            suspect.firstname = req.body.firstname
            suspect.lastname = req.body.lastname
            suspect.age = req.body.age
            suspect.gender = req.body.gender
            suspect.dob = req.body.dob
            suspect.middlename = req.body.middlename
            suspect.profile_photo = req.body.profile_photo
            suspect.city_origin = req.body.city_origin
            suspect.race = req.body.race
            suspect.height = req.body.height
            suspect.weight = req.body.weight
            suspect.eye_color = req.body.eye_color
            suspect.hair_color = req.body.hair_color
            suspect.current_city = req.body.current_city
            suspect.address = req.body.address
            suspect.skin_tone = req.body.skin_tone
            suspect.known_aliases = req.body.known_aliases
           }
           suspect.save(function(err, suspect){
               if(err){
                   sendJSONresponse(res, 404, err)
               }else{
                   sendJSONresponse(res, 200, suspect)
               }
           })
       })
}

module.exports.delete_person_suspect = function(req, res){
    var suspectId = req.params.suspectId
    if(suspectId){
        Suspect
            .findByIdAndRemove(suspectId)
            .exec(function(err, suspect){
                if(err){
                    sendJSONresponse(res, 404, err)
                }else{
                    sendJSONresponse(res, 204, null)
                }
            })
    }else{
        sendJSONresponse(res, 404, {"message":"suspect id is required"})
    }
}

module.exports.crimesCreate = function(req, res){
    
}