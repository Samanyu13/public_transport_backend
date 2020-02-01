const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

//auth/user/reqister
router.post('/register', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);
        let otp = Math.random().toString(36).substr(2, 8);

        //now elements can be easily retrieved from the json 'data'
        let info = {};
        info.username = data.userName;
        info.first_name = data.firstName;
        info.last_name = data.lastName;
        info.mobile_number = data.mobileNo;
        info.password = data.password;
        info.email = data.email;
        info.otp = otp;

        let mailInfo = {};
        mailInfo.username = data.userName;
        mailInfo.email = data.email;

        let result = await methods.Authentication.User.addUser(info);

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
            let confirmMail = await methods.EmailConfirmation.Send(mailInfo);
        }

        res.json({
            'success': result.success,
            'about': result.about,
            'status': result.status
        });
    }
    catch (err) {
        console.log('Error: ' + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

//auth/user/verify
router.post('/verify', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        let info = {};
        info.id = data.id;
        info.otp = data.otp;
        info.timestamp = data.timestamp;

        let conf = await methods.Authentication.User.verifyUser(info);

        res.json({
            'success': conf.success,
            'about': conf.about,
            'status': conf.status
        });
    }
    catch (err) {
        console.log("Error: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

module.exports = router;