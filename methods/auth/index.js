const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
const { sequelize } = require('./../../models');
let Authentication = {};

Authentication.addUser = async function (req, res) {
    console.log(req);
    try {
        let info = req;
        const hashedPassword = await new Promise((resolve,reject) => {
            bcrypt.hash(info.password,saltRounds,function(err, hash){
                if(err)
                    reject(err);
                resolve(hash);
            });
        });
        let seq = await sequelize.transaction( async function (t) {
        let details = {};
        let credentials = {};
        details.first_name = info.first_name;
        details.last_name = info.last_name;
        details.mobile_number = info.mobile_number;
        details.username = info.username;
        details.verified = false;

        people = await models.passenger_details
            .create(details, {
                transaction: t
            });
        });
        // console.log("XXX" + (people.username));

        return {
            'status': 200,
            'success': true
        };
    } catch (err) {
        console.log(err);
        return {
            'success': false,
            'err': err
        }
    }
}

module.exports = Authentication;