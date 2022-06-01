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
 // 

     for(var count=0; count<files.length ; count++){  
        //.push.files[count].name;
        //console.log(files[count].name);
        var name = files[count].name;
        var data = files[count].data;
        multipleFiles.push(name)

        fs.writeFile("./public/images/"+name,
        data, function(err){
            if(err){
                sendJSONresponse(res, 400, err)
            }else{
            
              // console.log(multipleFiles);
            }
        }) 
        
     }
     sendJSONresponse(res, 201, multipleFiles)      
}