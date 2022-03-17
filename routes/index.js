var express = require('express');
var router = express.Router();

/* GET home page. */


var ctrlAuth = require('../app_api/controller/authentication')
var ctrlPoliceOfficer = require('../app_api/controller/police_officer')
var ctrlStationOfficer = require('../app_api/controller/station_officer')

// registering users and login end points

router.post('/register', ctrlAuth.register_user)
router.post('/login', ctrlAuth.login)

router.get('/users', ctrlAuth.get_list_of_users)
router.get('/read_one_user/:userid', ctrlAuth.read_one_user)
router.put('/update_user/:userid', ctrlAuth.update_user)
router.put('/update_userrole/:userid',ctrlAuth.update_userrole)
router.put('/update_admin_name_and_email/:userid', ctrlAuth.update_admin_name_and_email)
router.put('/update_user_password/:userid',ctrlAuth.update_user_password)

router.delete('/delete_user/:userid',ctrlAuth.delete_user )
router.post('/upload_user_imagefile', ctrlAuth.upload_user_imagefile)

// creating person and adding criminal records

router.post('/add_person_suspect', ctrlPoliceOfficer.add_person_suspect)
router.get('/get_list_of_person_suspects', ctrlPoliceOfficer.get_list_of_person_suspects)
router.get('/read_one_person_suspect/:suspectId', ctrlPoliceOfficer.read_one_person_suspect)
router.put('/update_person_suspect/:suspectId', ctrlPoliceOfficer.update_person_suspect)
router.delete('/delete_person_suspect/:suspectId', ctrlPoliceOfficer.delete_person_suspect)



module.exports = router;
