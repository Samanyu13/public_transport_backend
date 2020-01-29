const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

router.post('/register', (req, res) => {
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

        methods.Authentication.addUser(info).then((result) => {
            console.log("www" + JSON.parse(result));
        });
        
        // if(result.success == true) {
        //     res.json({
        //         status: "Hello"
        //     });
        // }
    }
    catch(err) {
        console.log('Error: ' + err);
    }

});

module.exports = router;