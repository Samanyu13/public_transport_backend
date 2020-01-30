const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
const { sequelize } = require('./../../models');
let User = {};

User.addUser = async function (req, res) {
    console.log(req);
    try {
        let info = req;
        let hash;
        hash = await bcrypt.hash(info.password, saltRounds);

        let seq = await sequelize.transaction(async function (t) {
            let details = {};
            let credentials = {};
            details.first_name = info.first_name;
            details.last_name = info.last_name;
            details.mobile_number = info.mobile_number;
            details.username = info.username;
            details.verified = false;

            credentials.email = info.email;
            credentials.password = hash;

            people_details = await models.passenger_details
                .create(details, {
                    transaction: t
                });
            credentials.id = people_details.id;

            people_credentials = await models.passenger_credentials
                .create(credentials, {
                    transaction: t
                });
            console.log("XXX" + credentials);


        });


        return {
            'about': "Success..!",
            'status': 200,
            'success': true,
        };
    } catch (err) {
        let status, about;

        about = err;
        status = 100;
        if (err == 'SequelizeUniqueConstraintError') {
            // about = "Duplicate insertion of values...!";
            status = 111;
        }
        return {
            'about': about,
            'status': status,
            'success': false
        }
    }
}

module.exports = User;