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
         //  .select("name crimes")
           .exec(function(err, suspect){
               var response, crime;
               if(!suspect){
                   sendJSONresponse(res, 404, {"message":"suspect not found"})
                   return
               }else if(err){
                 sendJSONresponse(res, 404, err)
               }if(suspect.crimes && suspect.crimes.length > 0){
                   crime = suspect.crimes.id(req.params.crimeId)
                   if(!crime){
                       sendJSONresponse(res, 404, {"message":"individual has no crime"})
                   }else{
                     /*response = {
                          /* suspect:{ 
                               firstname: suspect.firstname,
                               lastname: suspect.lastname,
                               id: req.params.suspectId
                           }, 
                           crime: crime
                       } */

                       sendJSONresponse(res, 200, crime)
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
         if(!req.params.suspectId || !req.params.crimeId){
             sendJSONresponse(res, 404, {"message":"not found, suspect id and crime id required"})
             return
         }else{
             Suspect
               .findById(req.params.suspectId)
               .select('crimes')
               .exec(function(err, suspect){
                   var thisCrime
                   if(!suspect){
                       sendJSONresponse(res, 404, {"message":"suspect id not found"})
                       return
                   }else if(err){
                       sendJSONresponse(res, 404, err)
                       return
                   }if(suspect.crimes && suspect.crimes.length > 0){
                       thisCrime = suspect.crimes.id(req.params.crimeId)
                       if(!thisCrime){
                           sendJSONresponse(res, 404, {"message":"crime id not found"})
                       }else{

                        thisCrime.category = req.body.category,
                        thisCrime.counts = req.body.counts,
                        thisCrime.offenseDate = req.body.offenseDate,
                        thisCrime.offenseDescription = req.body.offenseDescription,
                        //thisCrime.registeringOfficer = req.body.officer
                        suspect.save(function(err, suspect){
                            if(err){
                                sendJSONresponse(res, 401, err)
                            }else{
                                sendJSONresponse(res, 200, thisCrime)
                            }
                        })
                       }
                   }else{
                       sendJSONresponse(res, 404, {"message":"no crime to update"})
                   }
               })
         }
}

module.exports.crimesStatusUpdate = function(req, res){
    if(!req.params.suspectId || !req.params.crimeId){
        sendJSONresponse(res, 404, {"message":"not found, suspect id and crime id required"})
        return
    }else{
        Suspect
          .findById(req.params.suspectId)
          .select('crimes')
          .exec(function(err, suspect){
              var thisCrime
              if(!suspect){
                  sendJSONresponse(res, 404, {"message":"suspect id not found"})
                  return
              }else if(err){
                  sendJSONresponse(res, 404, err)
                  return
              }if(suspect.crimes && suspect.crimes.length > 0){
                  thisCrime = suspect.crimes.id(req.params.crimeId)
                  if(!thisCrime){
                      sendJSONresponse(res, 404, {"message":"crime id not found"})
                  }else{ 
                   thisCrime.status = req.body.status,
                   thisCrime.statusDescription = req.body.statusDescription,
                   suspect.save(function(err, suspect){
                       if(err){
                           sendJSONresponse(res, 401, err)
                       }else{
                           sendJSONresponse(res, 200, thisCrime)
                       }
                   })
                  }
              }else{
                  sendJSONresponse(res, 404, {"message":"no crime to update"})
              }
          })
    }
}

module.exports.crimesDeleteOne = function(req, res){
    if(!req.params.suspectId || !req.params.crimeId){
        sendJSONresponse(res, 404, {"message":"not found, suspect id and crime id required"})
        return
    }else{
        Suspect
          .findById(req.params.suspectId)
          .select('crimes')
          .exec(function(err, suspect){
              if(!suspect){
                  sendJSONresponse(res, 404, {"message":"suspect not found"})
                  return
              }else if(err){
                  sendJSONresponse(res, 404, err)
              }
              if(suspect.crimes && suspect.crimes.length > 0){
                  if(!suspect.crimes.id(req.params.crimeId)){
                      sendJSONresponse(res, 404,{"message":"crime id not found"})
                  }else{
                     suspect.crimes.id(req.params.crimeId).remove()
                     suspect.save(function(err){
                         if(err){
                             sendJSONresponse(res, 404, err)
                         }else{
                             sendJSONresponse(res, 204, null)
                         }
                     })
                  }
              }else{
                  sendJSONresponse(res, 404,  {"message":"no crime to delete"})
              }
          })
    }
}



module.exports.read_count_crime_by_category = async function(req, res){
        await Suspect
              .aggregate([
                  {$unwind: '$crimes'},
                  {
                      $group: {
                        _id: "$crimes.category",
                        categoryCount: {$count:{}}
                  }
                },
                {$sort: {'categoryCount': 1}}
              ]).exec(function(err, crimes){
                  if(err){
                      sendJSONresponse(res, 401, err)
                  }else{
                      sendJSONresponse(res, 200, crimes)
                  }
              })
      
}

module.exports.count_all_registered_crimes = function(req, res){
    Suspect
         .aggregate([
             {$unwind: "$crimes"},
             {$group: {
               _id: 'crimes',
               countCrimes: {$count:{}}}
            }
            
            ]).exec(function(err, data){
                 if(err){
                     sendJSONresponse(res, 401, err)
                 }else{
                     sendJSONresponse(res, 200, data[0])
                 }
             })
     
}

module.exports.read_all_ongoing_cases = function(req, res){
        Suspect
           .find({'crimes.status': {$in:["Pending","Ongoing"]}})
           .exec(function(err, data){
               if(err){
                   sendJSONresponse(res, 401, err)
               }else{
                   sendJSONresponse(res, 200, data);
               }
           })
}


module.exports.read_all_concluded_cases = function(req, res){
    Suspect
        .find({'crimes.status': {$in:["Closed","Dismissed","Transferred"]}})
        .exec(function(err, data){
            if(err){
                sendJSONresponse(res, 401, err)
            }else{
                sendJSONresponse(res, 200, data);
            }
        })
}