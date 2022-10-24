var mongoose = require("mongoose")
var Suspect = mongoose.model("Suspect")
var fs = require('fs') 
const { count } = require("console")

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

module.exports.upload_multiple_files = function(req, res){
  var files = [];
  files = req.files.file; 
  var multipleFiles = []

     var count = 0;
     while(count<files.length){
        var name = files[count].name;
        var data = files[count].data;
        multipleFiles.push(files[count].name)
         
            fs.writeFile("./public/images/"+name,
            data, function(err){
                if(err){
                    sendJSONresponse(res, 400, err)
                }else{
                   console.log("mwalowa"+multipleFiles);
                }
            })
        count = count + 1;  
     }
  sendJSONresponse(res, 201, multipleFiles)  
}

module.exports.attachmentCreate = function(req, res){
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
                   //thisCrime.attachments = req.body.attachments
                   thisCrime.attachments.push(req.body.attachments)
                   suspect.save(function(err, suspect){
                       if(err){
                           sendJSONresponse(res, 401, err)
                       }else{
                           sendJSONresponse(res, 201, thisCrime)
                       }
                   })
                  }
              }else{
                  sendJSONresponse(res, 404, {"message":"no crime to update"})
              }
          })
    }
}

var addAttachments = function(req, res, suspect){
    if(!suspect){
        sendJSONresponse(res, 404, {"message":"suspect not found"})
    }else{
        suspect.crimes.push({
            attachments: req.body.attachments
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