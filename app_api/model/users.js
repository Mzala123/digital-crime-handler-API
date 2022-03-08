var mongoose = require('mongoose')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')


var userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    userrole: {
       type: String,
       required: true
    },
    imagename:{
      type: String,
      default: "anonymous.jpg"
    },
    hash: String,
    salt: String
})

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('base64'); 
}

userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('base64');
    return this.hash === hash
}

userSchema.methods.generateJwt = function(){
    var expiry = new Date()
    expiry.setDate(expiry.getDate()+7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: parseInt(expiry.getTime()/1000),
    }, process.env.JWT_SECRET)
}

mongoose.model('User', userSchema)