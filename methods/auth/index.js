const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
const { sequelize } = require('./../../models');
let Authentication = {};

Authentication.addUser = async function (req, res) {
    try {
        let info = req.info;
        bcrypt.hash(info.password, saltRounds, function (err, hash) {
            let seq = await sequelize.transaction(function (t) {
                let details = {};
                let credentials = {};
                details.passenger_id = info.passengerID;
                details.mobile_number = info.mobileNo;
                details.address = info.address;

                people = await models.passenger_details
                    .create(details, {
                        transaction: t
                    });

            });
            console.log(toString(people));
            return {
                'status': 200,
                'success': true
            };
        });
    } catch (err) {
        console.log(err);
        return {
            'success': false,
            'err': err
        }
    }

}