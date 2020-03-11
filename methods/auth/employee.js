const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
const { sequelize } = require('./../../models');
let Employee = {};

Employee.addEmployee = async function (req, res) {
    try {
        let info = req;
        let hash;
        hash = await bcrypt.hash(info.password, saltRounds);

        let seq = await sequelize.transaction(async function (t) {
            let details = {};
            details.mobile_number = info.mobile_number;
            details.username = info.username;
            details.verified = false;
            details.employee_id = info.employee_id;

            let credentials = {};
            credentials.email = info.email;
            credentials.password = hash;

            people_details = await models.employee_details
                .create(details, {
                    transaction: t
                });
            credentials.employee_id = people_details.employee_id;

            people_credentials = await models.employee_credentials
                .create(credentials, {
                    transaction: t
                });

            let confirmData = {};
            confirmData.employee_id = people_details.employee_id;
            confirmData.otp = info.otp;

            people_confirm = await models.confirm_employee
                .create(confirmData, { transaction: t });
        });


        return {
            'about': people_details.employee_id,
            'status': 200,
            'success': true,
        };
    } catch (err) {
        return {
            'about': err,
            'status': 500,
            'success': false,
        }
    }
}

Employee.verifyEmployee = async function (req, res) {
    try {
        //time to wait for otp in minutes
        let MIN = 15;
        let info = req;

        let details = await models.confirm_employee.findOne({
            where: {
                employee_id: info.employee_id
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
                let test = await models.employee_details.update({
                    verified: true
                }, {
                    where: {
                        employee_id: info.employee_id,
                    },
                });

                return {
                    'about': "Success..! Employee verified..!",
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
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
    finally {
        let x = await models.confirm_employee.destroy({
            where: {
                employee_id: req.employee_id
            }
        });
    }
}

Employee.AuthenticateEmployee = async function (req, res) {
    try {
        let credentials = await models.employee_credentials.findOne({
            where: {
                email: req.email
            }
        });

        //user not found
        if (credentials == null) {
            return {
                'about': "Invalid mail-ID :/",
                'status': 404,
                'success': false
            }
        }


        const match = await bcrypt.compare(req.password, credentials.password);

        //login successful
        if (match) {
            console.log("Password validation successful..!");

            let details = await models.employee_details.findOne({
                where: {
                    employee_id: credentials.employee_id
                }
            });

            //user details not found
            if (details == null) {
                return {
                    'about': "The user_details not found.. That's unlikely :/",
                    'status': 404,
                    'success': false
                }
            }

            //success..!
            const token = jwt.sign({
                employee_id: details.employee_id,
                email: details.email,
                mobile_number: details.mobile_number
            }, api_sec, {
                expiresIn: "1h"
            });

            return {
                'about': token,
                'status': 200,
                'success': true
            }
        }
        else {
            console.log("Error: " + err);
            return {
                'about': "Invalid password..! :(",
                'status': 400,
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

module.exports = Employee;