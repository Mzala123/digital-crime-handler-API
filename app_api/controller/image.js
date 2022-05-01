var mongoose = require("mongoose")
var Image = mongoose.model("Image")
var multer = require("multer")
var fs = require('fs')
const { contentType } = require("express/lib/response")


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
                data: fs.readFileSync("./public/images/"+req.files.file.name),
                contentType: 'image/'
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

module.exports.get_user_profile_image = async(req, res)=>{
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

module.exports.upload_case_files = function(req, res){
    const reqFiles = []
    for (var i = 0; i < req.files.length; i++) {
        reqFiles.push(fs.writeFile("./public/images/"+req.files.file.name,
        req.files.file.data))
    }
    
            sendJSONresponse(res,201,req.files.file.name)
      
   

    /*fs.writeFile("./public/images/"+req.files.file.name,
    req.files.file.data, function(err){
        if(err){
            sendJSONresponse(res, 400, err)
        }else{
            sendJSONresponse(res,201,req.files.file.name)
        }
    })*/

}