var passport = require('passport')
var mongoose = require('mongoose')
var User = mongoose.model('User')
var fileUpload = require('express-fileupload')
var fs = require('fs') 
const { use } = require('passport/lib')
const { send } = require('process')

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}


module.exports.register_user = function(req, res){
    if(!req.body.name || !req.body.email || !req.body.userrole || !req.body.password){
         sendJSONresponse(res, 400, {"message":"All fields are required"})
         return;
    }  
    var user = new User()
    user.name = req.body.name
    user.email = req.body.email
    user.userrole = req.body.userrole
    user.imagename = req.body.imagename
    user.setPassword(req.body.password)

    user.save(function(err){
        var token
        if(err){
            sendJSONresponse(res, 400, err)
        }else{
            token = user.generateJwt()
            sendJSONresponse(res, 201,{
                "token": token, "user":user
            })
        }
    })

}

module.exports.login = function(req, res){
    if(!req.body.email || !req.body.password){
        sendJSONresponse(res, 400, {
            "message": "All fields are required"
        })
        return;
    }
    passport.authenticate('local', function(err, user, info){
        var token
        if(err){
            sendJSONresponse(res, 400, err)
            return;
        }
        if(user){
            token = user.generateJwt()
            sendJSONresponse(res, 201,{
                "token":token, "user":user
            })
        }else{
            sendJSONresponse(res, 401, info)
        }
    })(req, res);
}

module.exports.upload_user_imagefile = function(req, res){
   // sendJSONresponse(res, 200, {"message":"ofcoz you did"});
    fs.writeFile("./public/images/"+req.files.file.name,
    req.files.file.data, function(err){
        if(err){
            sendJSONresponse(res, 400, err)
            console.log(err)
        }else{
            console.log(req.files.file.name)
            sendJSONresponse(res,201,req.files.file.name)
        }
    })
    
}

module.exports.get_list_of_users = function(req, res){
      User
       .find({"userrole": {$ne:"Admin"}}, {name:1, userrole:1, email:1})
       .exec(function(err, user){
           if(err){
             sendJSONresponse(res, 404, err)
           }else{
               console.log(user)
               sendJSONresponse(res, 200, user)
           }
       })
}

module.exports.read_one_user = function(req, res){
   if(!req.params.userid){
    sendJsonResponse(res, 404, {"message":" user id required"})
   }else if(req.params && req.params.userid){
       User
         .findById(req.params.userid)
         .exec(function(err, user){
             if(!user){
                sendJSONresponse(res, 404, {"message":"user not found"})
                return
             }else if(err){
                sendJSONresponse(res, 404, err)
                return
             }else{
                 sendJSONresponse(res, 200, user)
             }
         })
   }else{
      sendJSONresponse(res, 404, {"message":"not found, user id required"})
   }
}

module.exports.update_user = function(req, res){
      if(!req.params.userid){
          sendJSONresponse(res, 404, {"message":"Not found, user id is required"})
          return
      }
      User
       .findById(req.params.userid)
       .exec(function(err, user){
           if(err){
               sendJSONresponse(res, 404, err)
               return
           }else if(!user){
               sendJSONresponse(res, 404, {"message":"userid not found"})
               return
           }else{
               user.name = req.body.name
               user.email = req.body.email
               user.userrole = req.body.userrole
               user.setPassword(req.body.password)
               user.imagename = req.body.imagename
           }
         user.save(function(err, user){
            var token
             if(err){
                 sendJSONresponse(res, 404, err)
             }else{
                console.log("user updated successfully")
                token = user.generateJwt()
                sendJSONresponse(res, 200,{
                    "token": token
                })
             }
         })

       })
}


module.exports.update_userrole = function(req, res){
    if(!req.params.userid){
        sendJSONresponse(res, 404, {"message":"Not found, user id is required"})
        return
    }
    User
     .findById(req.params.userid)
     .exec(function(err, user){
         if(err){
             sendJSONresponse(res, 404, err)
             return
         }else if(!user){
             sendJSONresponse(res, 404, {"message":"userid not found"})
             return
         }else{
             user.userrole = req.body.userrole
         }
       user.save(function(err, user){
           if(err){
               sendJSONresponse(res, 404, err)
           }else{
              sendJSONresponse(res, 200, user)
           }
       })

     })
}


module.exports.update_user_password = function(req, res){
    if(!req.params.userid){
        sendJSONresponse(res, 404, {"message":"Not found, user id is required"})
        return
    }
    User
     .findById(req.params.userid)
     .exec(function(err, user){
         if(err){
             sendJSONresponse(res, 404, err)
             return
         }else if(!user){
             sendJSONresponse(res, 404, {"message":"userid not found"})
             return
         }else{
            user.setPassword(req.body.password)
         }
       user.save(function(err, user){
           if(err){
               sendJSONresponse(res, 404, err)
           }else{
              sendJSONresponse(res, 200, user)
           }
       })

     })
}

module.exports.update_admin_name_and_email = function(req, res){
    
    if(!req.params.userid){
        sendJSONresponse(res, 404, {"message":"Not found, user id is required"})
        return
    }
    User
     .findById(req.params.userid)
     .exec(function(err, user){
         if(err){
             sendJSONresponse(res, 404, err)
             return
         }else if(!user){
             sendJSONresponse(res, 404, {"message":"userid not found"})
             return
         }else{
            user.name = req.body.name
            user.email = req.body.email
            user.imagename = req.body.imagename
         }
       user.save(function(err, user){
           if(err){
               sendJSONresponse(res, 404, err)
           }else{
              sendJSONresponse(res, 200, user)
           }
       })

     })
}

module.exports.delete_user = function(req, res){
      var userid = req.params.userid
      if(userid){
          User
            .findByIdAndRemove(userid)
            .exec(function(err, user){
                if(err){
                    sendJSONresponse(res, 404, err)
                }else{
                    sendJSONresponse(res, 204, null)
                }
            })
      }else{
          sendJSONresponse(res, 404, {"message":"userid"})
      }
}

module.exports.read_users_count_by_userrole = function(req, res){
         User
           .aggregate([
               {$unwind: '$userrole'},
               { 
                   $group: {
                       _id: '$userrole',
                       userroleCount: {$count: {}},
                 }
               },
               {$sort: {'userroleCount': 1}}
           ])
           .exec(function(err, user){
               if(err){
                  sendJSONresponse(res, 404, err)
               }else{
                  sendJSONresponse(res, 200, user)
               }
           })   
} 

module.exports.read_count_all_users_in_system = function(req, res){
    User
      .countDocuments({})
      .exec(function(err, user){
          if(err){
              sendJSONresponse(res, 401, err)
          }else{
              sendJSONresponse(res, 200, user)
          }   
      })
}