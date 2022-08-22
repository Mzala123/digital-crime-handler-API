var mongoose = require("mongoose")
var Suspect = mongoose.model("Suspect")

var sendJSONresponse = function (res, status, content) {
    res.status(status)
    res.json(content)
}

module.exports.add_person_suspect = function (req, res) {
    if (!req.body.nationalId || !req.body.firstname || !req.body.lastname
        || !req.body.gender || !req.body.dob) {
        sendJSONresponse(res, 404, { "message": "Please fill in all required fields" })
        return
    }
    var suspect = new Suspect()
    suspect.nationalId = req.body.nationalId
    suspect.firstname = req.body.firstname
    suspect.lastname = req.body.lastname
    //suspect.age = req.body.age
    suspect.gender = req.body.gender
    suspect.dob = req.body.dob
    suspect.middlename = req.body.middlename
    suspect.profile_photo = req.body.profile_photo
    suspect.city_origin = req.body.city_origin
    suspect.race = req.body.race
    suspect.height = req.body.height
    suspect.weight = req.body.weight
    suspect.eye_color = req.body.eye_color
    suspect.hair_color = req.body.hair_color
    suspect.current_city = req.body.current_city
    suspect.address = req.body.address
    suspect.skin_tone = req.body.skin_tone
    suspect.known_aliases = req.body.known_aliases

    suspect.save(function (err) {
        if (err) {
            sendJSONresponse(res, 404, err)
        } else {
            sendJSONresponse(res, 201, suspect)
        }
    })
}

module.exports.get_list_of_person_suspects = function (req, res) {
    Suspect
        .find({}, {
            nationalId: 1,
            firstname: 1,
            lastname: 1,
            age: { $dateDiff: { startDate: "$dob", endDate: "$$NOW", unit: "year" } },
            gender:1,
            dob: { $dateToString: { format: "%Y-%m-%d", date: "$dob" } },
            middlename: 1,
            profile_photo: 1,
            city_origin: 1,
            race: 1,
            height: 1,
            weight: 1,
            eye_color: 1,
            hair_color: 1,
            current_city: 1,
            address: 1,
            skin_tone: 1,
            known_aliases: 1,
            crimes: 1,
        })
        .exec(function (err, suspect) {
            if (err) {
                sendJSONresponse(res, 404, err)
            } else {
                console.log(suspect)
                sendJSONresponse(res, 200, suspect)
            }
        })
}

module.exports.get_list_of_suspects_with_alleged_crime = function (req, res) {
    Suspect
        .find({ crimes: { $exists: true, $ne: [] } })
        .exec(function (err, suspect) {
            if (err) {
                sendJSONresponse(res, 404, err)
            } else {
                console.log(suspect)
                sendJSONresponse(res, 200, suspect)
            }
        })
}

module.exports.read_one_person_suspect = function (req, res) {
    //var id = req.params.suspectId
    if (!req.params.suspectId) {
        sendJSONresponse(res, 404, { "message": "suspect id is required" });
    }
    else {
        Suspect
            .aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.params.suspectId) } },
                {
                    $project: {
                        nationalId: 1,
                        firstname: 1,
                        lastname: 1,
                        age: { $dateDiff: { startDate: "$dob", endDate: "$$NOW", unit: "year" } },
                        gender: 1,
                        dob: { $dateToString: { format: "%Y-%m-%d", date: "$dob" } },
                        middlename: 1,
                        profile_photo: 1,
                        city_origin: 1,
                        race: 1,
                        height: 1,
                        weight: 1,
                        eye_color: 1,
                        hair_color: 1,
                        current_city: 1,
                        address: 1,
                        skin_tone: 1,
                        known_aliases: 1,
                        crimes: 1,
                        // crimes: { $dateToString: { format: "%Y-%m-%d", date: "$crimes.offenseDate" } },
                        // crimes.offenseDate
                    }
                }

            ]).exec(function (err, suspect) {
                if (!suspect) {
                    sendJSONresponse(res, 404, { "message": "suspect not found" })
                } else if (err) {
                    sendJSONresponse(res, 404, err)
                } else {
                    sendJSONresponse(res, 200, suspect[0])
                }
            })
    }


}

module.exports.update_person_suspect = function (req, res) {
    if (!req.params.suspectId) {
        sendJSONresponse(res, 404, { "message": "Not found, suspect id is required" })
        return
    }
    Suspect
        .findById(req.params.suspectId)
        .exec(function (err, suspect) {
            if (err) {
                sendJSONresponse(res, 404, err)
            } else if (!suspect) {
                sendJSONresponse(res, 404, { "message": "suspect id not found" })
            } else {
                suspect.nationalId = req.body.nationalId
                suspect.firstname = req.body.firstname
                suspect.lastname = req.body.lastname
                suspect.gender = req.body.gender
                suspect.dob = req.body.dob
                suspect.middlename = req.body.middlename
                suspect.profile_photo = req.body.profile_photo
                suspect.city_origin = req.body.city_origin
                suspect.race = req.body.race
                suspect.height = req.body.height
                suspect.weight = req.body.weight
                suspect.eye_color = req.body.eye_color
                suspect.hair_color = req.body.hair_color
                suspect.current_city = req.body.current_city
                suspect.address = req.body.address
                suspect.skin_tone = req.body.skin_tone
                suspect.known_aliases = req.body.known_aliases
            }
            suspect.save(function (err, suspect) {
                if (err) {
                    sendJSONresponse(res, 404, err)
                } else {
                    sendJSONresponse(res, 200, suspect)
                }
            })
        })
}

module.exports.delete_person_suspect = function (req, res) {
    var suspectId = req.params.suspectId
    if (suspectId) {
        Suspect
            .findByIdAndRemove(suspectId)
            .exec(function (err, suspect) {
                if (err) {
                    sendJSONresponse(res, 404, err)
                } else {
                    sendJSONresponse(res, 204, null)
                }
            })
    } else {
        sendJSONresponse(res, 404, { "message": "suspect id is required" })
    }
}

module.exports.read_count_suspects_by_gender = async function (req, res) {
    Suspect
        .aggregate([
            {
                $group: {
                    _id: '$gender',
                    countByGender: { $count: {} }
                }
            },
            { $sort: { 'countByGender': 1 } }
        ]).exec(function (err, suspectGender) {
            if (err) {
                sendJSONresponse(res, 404, err)
            } else {
                sendJSONresponse(res, 200, suspectGender)
            }
        })
}

module.exports.read_count_all_suspects_in_system = async function (req, res) {
    Suspect
        .countDocuments()
        .exec(function (err, suspects) {
            if (err) {
                sendJSONresponse(res, 404, err)
            } else {
                sendJSONresponse(res, 200, suspects)
            }
        })

    //Suspect.createView()
}

