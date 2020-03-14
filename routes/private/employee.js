const express = require('express');
const router = express.Router();
const methods = require('./../../methods');
const auth = require('./../../middleware/auth');

//private/employee/startTrip
router.post('/startTrip', auth.jwtVerifyToken, async function (req, res) {
    try {
        let data = JSON.stringify(req.body);
        //req.decoded - details
        data = JSON.parse(data);
        let info = {};
        info.busNo = data.busNo;
        info.regNo = data.regNo;
        info.busMake = data.busMake;
        info.employeeCode = data.employeeCode;
        info.routeNo = data.routeNo;

        let about = {};
        let status;
        let success;

        let r1 = await methods.BusInfo.addToLiveBuses(info);

        //if adding to LiveBuses succeeds
        if (r1.success) {
            let stop_ids = await methods.BusInfo.getAllStopsOnTheRoute(data.routeNo);

            //if getting AllStops on a particular route succeeds
            if (stop_ids.success) {
                let IDs = JSON.stringify(stop_ids.about);
                IDs = JSON.parse(IDs);

                //if getting StopName from IDs succeeds
                let stop_names = await methods.BusInfo.getStopNamefromID(IDs);

                if (stop_names.success) {
                    about.data = stop_names.about;
                    about.comment = "Successfully retrieved data..!";
                    status = 200;
                    success = true;
                }
                //if getting StopName from IDs failed
                else {
                    about.data = null;
                    about.comment = stop_names.about;
                    status = stop_names.status;
                    success = stop_names.success;
                }
            }
            //if getting AllStops on a particular route failed
            else {
                about.data = null;
                about.comment = stop_ids.about;
                status = stop_ids.status;
                success = stop_ids.success;
            }

        }
        //if adding to LiveBuses failed
        else {
            about.data = null;
            about.comment = r1.about;
            status = r1.status;
            success = r1.success;
        }
        //returning the final json
        res.json({
            'success': success,
            'about': about,
            'status': status
        });

    }
    catch (err) {
        console.log("Route-Error: " + err);

        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
})

//private/employee/endTrip
router.post('/endTrip', auth.jwtVerifyToken, async function (req, res) {
    try {
        let data = JSON.stringify(req.body);
        //req.decoded - details
        data = JSON.parse(data);
        let info = data.employeeCode;

        let live = await methods.BusInfo.getLiveBusByEmpID(info);
        console.log("LIVE: " + live.about);

        if (live.success) {
            let bus = live.about;
            let del = await methods.BusInfo.removeFromLiveAndAddToLog(bus);

            res.json({
                'success': del.success,
                'about': { 'data': null, 'comment': del.about },
                'status': del.status
            });
        }
        else {
            res.json({
                'success': live.success,
                'about': { 'data': null, 'comment': live.about },
                'status': live.status
            });
        }
    }
    catch (err) {
        console.log("Route-Error: " + err);

        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
})

module.exports = router;