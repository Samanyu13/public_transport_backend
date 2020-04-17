const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

//auth/adminAuth/register
router.post('/register', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);
        let about = {};

        let info = {};

        info.employee_id = data.employeeID;
        info.password = data.password;

        let result = await methods.Authentication.AdminAuth.addNewAdmin(info);

        console.log("RESULT: " + JSON.stringify(result));
        if (!result.success) {
            about.data = null;
            about.comment = result.about;
        }
        else {
            about.data = result.about;
            about.comment = null;
        }

        res.json({
            'success': result.success,
            'about': about,
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

//auth/adminAuth/login
router.post('/login', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        let info = {};
        info.employee_id = data.employeeID;
        info.password = data.password;

        let conf = await methods.Authentication.AdminAuth.authenticateAdmin(info);

        res.json({
            'success': conf.success,
            'about': { 'data': conf.about.data, 'comment': conf.about.comment },
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

//auth/adminAuth/login
router.post('/removeByID', async (req, res) => {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        let info = data.employeeID;

        let conf = await methods.Authentication.AdminAuth.removeAdminByID(info);

        res.json({
            'success': conf.success,
            'about': { 'data': conf.about.data, 'comment': conf.about.comment },
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

//auth/adminAuth/login
router.get('/login', function (req, res) {
    res.render('private/login', { title: 'Express' });
});

module.exports = router;