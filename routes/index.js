var express = require('express');
var router = express.Router();

/* GET home page. */


var ctrlAuth = require('../app_api/controller/authentication')
var ctrlPoliceOfficer = require('../app_api/controller/police_officer')
var ctrlStationOfficer = require('../app_api/controller/station_officer')
var ctrlCrime = require('../app_api/controller/crime')
var ctrlImage = require('../app_api/controller/image')

var ctrlMail = require('../app_api/controller/mailing');

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

//user section dashboard queries
router.get('/read_users_count_by_userrole', ctrlAuth.read_users_count_by_userrole)
router.get('/read_count_all_users_in_system', ctrlAuth.read_count_all_users_in_system)


// creating person and adding criminal records

router.post('/add_person_suspect', ctrlPoliceOfficer.add_person_suspect)

router.get('/get_list_of_person_suspects', ctrlPoliceOfficer.get_list_of_person_suspects)
router.get('/get_list_of_suspects_with_alleged_crime', ctrlPoliceOfficer.get_list_of_suspects_with_alleged_crime)
router.get('/read_one_person_suspect/:suspectId', ctrlPoliceOfficer.read_one_person_suspect)
router.put('/update_person_suspect/:suspectId', ctrlPoliceOfficer.update_person_suspect)
router.delete('/delete_person_suspect/:suspectId', ctrlPoliceOfficer.delete_person_suspect)

// adding crime details committed by a suspect
router.post('/add_person_suspect/:suspectId/add_crime_details', ctrlCrime.crimesCreate)
router.get('/read_one_person_suspect/:suspectId/crimes/:crimeId', ctrlCrime.crimesReadOne)
router.put('/read_one_person_suspect/:suspectId/crimes/:crimeId', ctrlCrime.crimesUpdateOne)
router.delete('/read_one_person_suspect/:suspectId/crimes/:crimeId', ctrlCrime.crimesDeleteOne)
router.put('/update_crime_case_status_details/:suspectId/crimes/:crimeId', ctrlCrime.crimesStatusUpdate)

router.get('/read_count_crime_by_category', ctrlCrime.read_count_crime_by_category)
router.get('/count_all_registered_crimes', ctrlCrime.count_all_registered_crimes)

// station officer end points
//router.post('/', ctrlStationOfficer);

// end of station officer APIs

// send email notification API
router.post('/send_nofification_email_to_suspect', ctrlMail.send_nofification_email_to_suspect)
router.get('/read_nofification_email_details/:suspectId/crimes/:crimeId', ctrlMail.read_nofification_email_details)
//end of email notification API

// upload image to database API
router.post('/upload_user_profile', ctrlImage.upload_user_profile)
router.get('/get_user_profile_image/:imageId', ctrlImage.get_user_profile_image)


module.exports = router;
