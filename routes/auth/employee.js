const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

//auth/employee/register
router.post('/register', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);
        let otp = Math.random().toString(36).substr(2, 8);

        //now elements can be easily retrieved from the json 'data'
        let info = {};
        info.employee_id = data.employee_id;
        info.username = data.userName;
        info.mobile_number = data.mobileNo;
        info.password = data.password;
        info.email = data.email;
        info.otp = otp;

        let mailInfo = {};
        mailInfo.username = data.userName;
        mailInfo.email = data.email;

        let result = await methods.Authentication.Employee.addEmployee(info);
        ////////////////////DEBUG////////////////////
        console.log("***********DEBUG*************");
        console.log("Route: Auth - Register");
        console.log(JSON.stringify(result));
        console.log("About: " + result.about);
        console.log("Status: " + result.status);
        console.log("Success: " + result.success);
        console.log("***********DEBUG*************");
        ////////////////////DEBUG////////////////////

        if (result.success == true) {
            mailInfo.otp = otp;
            await methods.EmailConfirmation.Send(mailInfo);
        }

        res.json({
            'success': result.success,
            'about': { 'data': result.about, 'comment': null },
            'status': result.status
        });
    }
    catch (err) {
        console.log('Error: ' + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

//auth/employee/verify
router.post('/verify', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        let info = {};
        info.employee_id = data.employee_id;
        info.otp = data.otp;
        info.timestamp = data.timestamp;

        let conf = await methods.Authentication.Employee.verifyEmployee(info);
        res.json({
            'success': conf.success,
            'about': { 'data': null, 'comment': conf.about },
            'status': conf.status
        });
    }
    catch (err) {
        console.log("Error: " + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

//auth/employee/login
router.post('/login', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        let info = {};
        info.email = data.email;
        info.password = data.password;

        let conf = await methods.Authentication.Employee.AuthenticateEmployee(info);

        res.json({
            'success': conf.success,
            'about': { 'data': conf.about, 'comment': "Successfully authenticated..! :)" },
            'status': conf.status
        });
    }
    catch (err) {
        console.log("Error: " + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

module.exports = router;