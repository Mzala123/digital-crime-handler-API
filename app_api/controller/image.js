var mongoose = require("mongoose")
var Image = mongoose.model("Image")
var multer = require("multer")
var fs = require('fs')


var storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./public/images/")
    },
    filename: (req, file, cb) =>{
        cb(null, file.filename)
    }
}) 

var upload = multer({storage: storage})

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}

module.exports.upload_user_profile = function(req, res){

    fs.writeFile("./public/images/"+req.files.file.name,
    req.files.file.data, function(err){
        if(err){
            sendJSONresponse(res, 400, err)
        }else{
            obj= {
            imagename: req.files.file.name,
            img:{
                data: fs.readFileSync("./public/images/"+req.files.file.name)
            }
            }
            Image.create(obj, (err, image)=>{
                if(err){
                    sendJSONresponse(res, 404, err)
                }else{
                    image.save()
                    sendJSONresponse(res, 201, image)
                }
            })
        }
    })
}

module.exports.get_user_profile_image = function(req, res){
       if(!req.params.imageId){
           sendJSONresponse(res, 404, {"message":"image id is required"})
       }
       Image
         .findById(req.params.imageId)
         .exec(function(err, image){
              if(err){
                  sendJSONresponse(res, 404, err)
              }else{
                  sendJSONresponse(res, 200, image)
              }
         })
}