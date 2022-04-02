var mongoose = require("mongoose")
var Suspect = mongoose.model("Suspect")

var sendJSONresponse = function(res, status, content){
    res.status(status)
    res.json(content)
}
