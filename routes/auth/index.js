const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

router.post('/register', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        //now elements can be easily retrieved from the json 'data'
        let info = {};
        info.username = data.userName;
        info.first_name = data.firstName;
        info.last_name = data.lastName;
        info.mobile_number = data.mobileNo;
        info.password = data.password;
        info.email = data.email;

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

            //     let confirmMail = await methods.EmailConfirmation.Send(mailInfo);
            res.json({
                'status': "Successfully added the user to db",
                'success': true
            });
        }
        else {
            res.json({
                'success': false,
                'about': "Error adding the user..!",
                'status': 112
            })
        }
    }
    catch (err) {
        console.log('Error: ' + err);
        res.json({
            'success': false,
            'about': err,
            'status': 100
        });
    }

});

module.exports = router;