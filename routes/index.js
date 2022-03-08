var express = require('express');
var router = express.Router();

/* GET home page. */


var ctrlAuth = require('../app_api/controller/authentication')

// registering users and login end points
router.post('/register', ctrlAuth.register_user)
router.post('/login', ctrlAuth.login)

router.get('/users', ctrlAuth.get_list_of_users)
router.get('/read_one_user/:userid', ctrlAuth.read_one_user)
router.put('/update_user/:userid', ctrlAuth.update_user)
router.delete('/delete_user/:userid',ctrlAuth.delete_user )
router.post('/upload_user_imagefile', ctrlAuth.upload_user_imagefile)



module.exports = router;
