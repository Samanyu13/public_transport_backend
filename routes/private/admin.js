const express = require('express');
const router = express.Router();
const auth = require('./../../middleware/auth');
const methods = require('./../../methods');

//private/admin/dashboard
router.get('/dashboard', function (req, res) {
    res.render('private/admin/dashboard', { title: 'Express' });
});

//private/admin/toVerify
router.get('/toVerify', async function (req, res) {
    try {
        let unconfirmed = await methods.RequestBus.getAllUnconfirmedRoutes();
        console.log("QQQ" + JSON.stringify(unconfirmed));
        let data = unconfirmed.about;
        res.render('private/admin/toverify', {
            'data': data,
            'success': unconfirmed.success,
            'status': unconfirmed.status
        });

    }
    catch (err) {
        res.render('/error', {
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

//private/admin/confirmed
router.get('/confirmed', function (req, res) {
    res.render('private/admin/confirmed', { title: 'Express' });
});

//private/admin/verification
router.get('/verification/:id', async function (req, res) {
    let id = req.params.id;
    let result = await methods.RequestBus.getUnconfirmedRouteByID(id);
    let data = {};

    if (result.success) {
        if (result.time_frame == 0) {
            data.time_frame = '6AM to 12PM (Morning)';
        }
        else if (result.time_frame == 1) {
            data.time_frame = '12PM to 6PM (Evening)';
        }
        else {
            data.time_frame = '6PM to 6AM (Night)';
        }

        let getName = await methods.BusInfo.getRouteNameByID(result.route_id);
        data.route_name = getName.about;
        data.route_id = result.route_id;

        res.render('private/admin/verification', { 'data': data });

    }
    else {
        console.log("SCENE..!");
    }

});

module.exports = router;