const express = require('express');
const router = express.Router();
// const auth = require('./../../middleware/auth');
const methods = require('./../../methods');

//private/admin/dashboard
router.get('/dashboard', function (req, res) {
    res.render('private/admin/dashboard');
});

//private/admin/toVerify
router.get('/toVerify', async function (req, res) {
    try {
        let unconfirmed = await methods.RequestBus.getAllUnconfirmedRoutes();
        let data = unconfirmed.about;
        res.render('private/admin/toverify', {
            'data': data,
            'success': unconfirmed.success,
            'status': unconfirmed.status
        });

    }
    catch (err) {
        console.log(err);
        req.session.message = {
            type: 'danger',
            intro: 'Error',
            message: err
        };
        res.redirect('/error');
    }
});

//private/admin/confirmed
router.get('/confirmed', async function (req, res) {
    try {
        let confirmed = await methods.RequestBus.getAllConfirmedRoutes();
        let data = confirmed.about;
        res.render('private/admin/confirmed', {
            'data': data,
            'success': confirmed.success,
            'status': confirmed.status
        });

    }
    catch (err) {
        console.log(err);
        req.session.message = {
            type: 'danger',
            intro: 'Error..!',
            message: err
        };
        res.redirect('/error');
    }
});

//private/admin/verification
router.get('/verification/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await methods.RequestBus.getUnconfirmedRouteByID(id);
        let data = {};

        if (result.success) {
            data.time_frame = result.about.time_frame;
            data.route_id = result.about.route_id;
            data.date = result.about.date;

            let getName = await methods.BusInfo.getRouteNameByID(result.about.route_id);
            data.route_name = getName.about;
            data.id = id;

            console.log("RESULT: " + JSON.stringify(data));

            res.render('private/admin/verification', { 'data': data });

        }
        else {
            console.log("SCENE..!");
            req.session.message = {
                type: 'warning',
                intro: 'Fetching Bus Data Failed..!',
                message: result.about.comment
            };
        }
    }
    catch (err) {
        console.log(err);
        req.session.message = {
            type: 'danger',
            intro: 'Error',
            message: err
        };
        res.redirect('/error');
    }
});

//private/admin/confirmation
router.post('/confirmation', async function (req, res) {
    let flag;
    try {
        let data = {};
        data.time = req.body.time;
        data.time_frame = req.body.time_frame;
        data.route_id = req.body.route_id;
        data.date = req.body.date;
        let ans = await methods.RequestBus.confirmTrip(data);

        flag = ans.success;
        let path = (ans.success) ? '/private/admin/dashboard' : '/private/admin/toVerify';

        if (!ans.success) {
            path = '/private/admin/confirmation/' + id;
            req.session.message = {
                type: 'danger',
                intro: 'Confirming Bus Failed..!',
                message: ans.about.comment
            };
        }
        else {
            path = '/private/admin/dashboard';
            req.session.message = {
                type: 'success',
                intro: 'Bus Confirmed..!',
                message: ans.about.comment
            };
        }

        res.redirect(path);
    }
    catch (err) {
        console.log(err);
        req.session.message = {
            type: 'danger',
            intro: 'Error',
            message: err
        };
        res.redirect('/error');
    }
    finally {
        if (flag) {
            await methods.RequestBus.removeUnconfirmedRouteByID(id);
        }
    }
});

module.exports = router;