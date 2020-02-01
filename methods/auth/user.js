const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
const { sequelize } = require('./../../models');
let User = {};

User.addUser = async function (req, res) {
    try {
        let info = req;
        let hash;
        hash = await bcrypt.hash(info.password, saltRounds);

        let seq = await sequelize.transaction(async function (t) {
            let details = {};
            details.first_name = info.first_name;
            details.last_name = info.last_name;
            details.mobile_number = info.mobile_number;
            details.username = info.username;
            details.verified = false;

            let credentials = {};
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

            let confirmData = {};
            confirmData.id = people_details.id;
            confirmData.otp = info.otp;

            people_confirm = await models.confirm_user
                .create(confirmData, { transaction: t });
        });


        return {
            'about': "Successfully added the user to db and sent mail",
            'status': 200,
            'success': true,
        };
    } catch (err) {
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

User.verifyUser = async function (req, res) {
    try {
        //time to wait for otp in minutes
        let MIN = 15;
        let info = req;

        let details = await models.confirm_user.findOne({
            where: {
                id: info.id
            }
        });
        if (details == null) {
            return {
                'about': "The otp is currently invalid/user not found  :/",
                'status': 404,
                'success': false
            }
        }
        var date1 = new Date(details.createdAt);
        var date2 = new Date(req.timestamp);
        let recTIME = Math.floor((date2.getTime() - date1.getTime()) / 1000);
        let oriTIME = MIN * 60;

        //check for timeout 
        if (oriTIME > recTIME) {
            if (details.otp == info.otp) {
                let test = await models.passenger_details.update({
                    verified: true
                }, {
                    where: {
                        id: info.id,
                    },
                });

                return {
                    'about': "Success..! User verified..!",
                    'status': 200,
                    'success': true
                }
            }
            else {
                return {
                    'about': "Oops..! Wrong OTP..:|",
                    'status': 400,
                    'success': true
                }
            }
        }
        else {
            return {
                'about': "Timeout..!",
                'status': 408,
                'success': false
            }
        }
    }
    catch (err) {
        console.log("Error: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
    finally {
        let x = await models.confirm_user.destroy({
            where: {
                id: req.id
            }
        });
    }
}

module.exports = User;