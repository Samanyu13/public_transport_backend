const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const models = require('./../../models');
const api_sec = require('./../../config/api.json').API_SECRET;
let AdminAuth = {};

/**
 * Adds new admin
 */
AdminAuth.addNewAdmin = async function (req) {
    try {
        let info = req;
        let hash = await bcrypt.hash(info.password, saltRounds);

        let credentials = {};
        credentials.employee_id = info.employee_id;
        credentials.password = hash;

        let result = await models.admin_model
            .create(credentials);

        return {
            'about': result.employee_id,
            'status': 200,
            'success': true,
        };
    } catch (err) {
        let about = err;
        let status = 500;
        console.log("Error-Methods: " + err);

        if (err.name == 'SequelizeUniqueConstraintError') {
            about = "EMPLOYEE ADMIN ALREADY EXISTS..!";
            status = 409;
        }

        return {
            'about': about,
            'status': status,
            'success': false
        }
    }
}

/**
 * Authenticates the admin
 */
AdminAuth.authenticateAdmin = async function (req) {
    try {
        let employee_id = req.employee_id;
        let password = req.password;

        let credentials = await models.admin_model.findOne({
            where: {
                employee_id: employee_id
            }
        });

        //admin not found
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

        const match = await bcrypt.compare(password, credentials.password);
        //login successful
        if (match) {
            console.log("Password validation successful..!");

            let details = await models.admin_model.findOne({
                where: {
                    employee_id: credentials.employee_id
                }
            });

            //user details not found
            if (details == null) {
                return {
                    'about': {
                        'data': null,
                        'comment': "The employee_details not found.. That's unlikely :/"
                    },
                    'status': 404,
                    'success': false
                }
            }

            //success..!
            const token = jwt.sign({
                employee_id: credentials.employee_id,
            }, api_sec, {
                expiresIn: "1d"
            });

            return {
                'about': {
                    'data': { 'token': token },
                    'comment': null
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

/**
 * Removes an admin using his/ her ID
 */
AdminAuth.removeAdminByID = async function (req) {
    try {
        let info = req;

        let result = await models.admin_model
            .destroy({
                where: {
                    employee_id: info
                }
            });

        return {
            'about': result,
            'status': 200,
            'success': true,
        };
    } catch (err) {
        let about = err;
        let status = 500;
        console.log("Error-Methods: " + err);

        if (err.name == 'SequelizeUniqueConstraintError') {
            about = "EMPLOYEE ADMIN ALREADY EXISTS..!";
            status = 409;
        }

        return {
            'about': about,
            'status': status,
            'success': false
        }
    }
}

module.exports = AdminAuth;