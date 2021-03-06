const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
const { sequelize } = require('./../../models');
let User = {};

/**
 * Adds the newly registered user to the database.
 * Required set of inputs include --> mobile_number, 
 * username, email, and password 
 */
User.addUser = async function (req) {
    try {
        let info = req;
        let hash;
        let people_details;
        hash = await bcrypt.hash(info.password, saltRounds);

        let seq = await sequelize.transaction(async function (t) {
            let details = {};
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

            await models.passenger_credentials
                .create(credentials, {
                    transaction: t
                });

            let confirmData = {};
            confirmData.id = people_details.id;
            confirmData.otp = info.otp;

            await models.confirm_user
                .create(confirmData, { transaction: t });
        });

        console.log("Transaction Output: " + seq);

        return {
            'about': people_details.id,
            'status': 200,
            'success': true,
        };
    } catch (err) {
        let about = "";
        let status = 500;
        console.log("Error-Methods: " + err);

        if (err['name'] == 'SequelizeUniqueConstraintError') {
            about = err['errors'][0].message.toUpperCase();
            status = 409;
            console.log(about);
        }

        return {
            'about': about,
            'status': status,
            'success': false
        }
    }
}

/**
 * Verification of the user's account happens here.
 * Required set of inputs include id(of the user), 
 * otp and timestamp. 
 */
User.verifyUser = async function (req) {
    try {
        //time to wait for otp in minutes
        let MIN = 15;
        let info = req;

        let details = await models.confirm_user.findOne({
            where: {
                id: info.id
            }
        });

        //user not found
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
                await models.passenger_details.update({
                    verified: true
                }, {
                    where: {
                        id: info.id,
                    },
                });

                await models.confirm_user.destroy({
                    where: {
                        id: req.id
                    }
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
                    'status': 422,
                    'success': false
                }
            }
        }
        else {
            await models.confirm_user.destroy({
                where: {
                    id: req.id
                }
            });
            return {
                'about': "Timeout..!",
                'status': 408,
                'success': false
            }
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

/**
 * Authenticates the user. Upon proper authentication, 
 * the user is provided with a token as part of
 * authorisation needs. Takes in email and password as the inputs.
 */
User.AuthenticateUser = async function (req) {
    try {
        let credentials = await models.passenger_credentials.findOne({
            where: {
                email: req.email
            }
        });

        //user not found
        if (credentials == null) {
            return {
                'about': {
                    'data': null,
                    'comment': "Invalid mail-ID :/"
                },
                'status': 404,
                'success': false
            }
        }


        const match = await bcrypt.compare(req.password, credentials.password);

        //login successful
        if (match) {
            console.log("Password validation successful..!");

            let details = await models.passenger_details.findOne({
                where: {
                    id: credentials.id
                }
            });

            //user details not found
            if (details == null) {
                return {
                    'about': {
                        'data': null,
                        'comment': "The user_details not found.. That's unlikely :/"
                    },
                    'status': 404,
                    'success': false
                }
            }

            //success..!
            const token = jwt.sign({
                id: details.id,
                email: details.email,
                mobile_number: details.mobile_number
            }, api_sec, {
                expiresIn: "1d"
            });

            return {
                'about': {
                    'data': { 'token': token, 'name': details.username },
                    'comment': details.id
                },
                'status': 200,
                'success': true
            }
        }
        else {
            console.log("Invalid Password..!");
            return {
                'about': {
                    'data': null,
                    'comment': "Invalid password..! :("
                },
                'status': 400,
                'success': false
            }
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
        return {
            'about': {
                'data': null,
                'comment': err
            },
            'status': 500,
            'success': false
        }
    }
}

module.exports = User;