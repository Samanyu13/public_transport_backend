const express = require('express');
const router = express.Router();
const methods = require('./../../methods');
// const io = require('./../../node_modules/socket.io-client/dist/socket.io');
const auth = require('./../../middleware/auth');

/***************************************************************
TIME FRAME DIVISION
-------------------
6AM to 12PM (Morning)   --> 0
12PM to 6PM (Evening)   --> 1
6PM to 6AM (Night)      --> 2

***************************************************************/

//private/user/requestbus/requestbusInput
router.post('/requestbusInput', auth.jwtVerifyToken, async function (req, res) {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);

        let comment = "";
        let success = false;
        let status = 0;

        let check = {};
        check.route_id = data.route_id;
        check.date = data.date;
        check.time_frame = data.time_frame;

        let tosend = {};
        tosend = check;
        tosend.count = data.count;
        tosend.user_id = data.user_id;

        let ans = await methods.RequestBus.checkRecordExistance(check);
        console.log("Res of checkRecordExistance: " + JSON.stringify(ans));

        if (ans.success) {
            let nextCheck = {};
            nextCheck.bus_request_id = ans.about;
            nextCheck.user_id = data.user_id;

            //check if the user is has already applied for this route
            let dupl = await methods.RequestBus.isUserDuplicateEntry(nextCheck);
            console.log("Res of isUserDuplicateEntry: " + JSON.stringify(ans));

            if (dupl.success) {
                //Duplicate --> this means he can't apply again
                comment = dupl.about;
                status = 409;
                success = false;
            }

            else {
                //Not duplicate and hence add that data
                tosend.bus_request_id = ans.about;
                let exist = await methods.RequestBus.updateExistingRecord(tosend);

                if (exist.success) {

                    //check if the count exceeded the threshold
                    let notify = await methods.RequestBus.ifThresholdExceed(ans.about);
                    console.log(notify.about);

                    if (notify.success) {
                        //exceeded the threshold
                        console.log("Res of checking threshold: " + JSON.stringify(notify));
                        console.log("CHECK: " + JSON.stringify(check));
                        let x = await methods.RequestBus.insertToBusesForVerification(check);
                        console.log(x.about);
                    }

                }
                comment = exist.about;
                status = exist.status;
                success = exist.success;
            }

        }
        else {
            //No entry found; so add the data 
            let newOne = await methods.RequestBus.addNewRecord(tosend);
            comment = newOne.about;
            status = newOne.status;
            success = newOne.success;
        }
        // */
        res.json({
            'success': success,
            'about': { 'data': null, 'comment': comment },
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
});

//private/user/requestbus/getAllToBeVerifiedRoutes
router.get('/getAllToBeVerifiedRoutes', auth.jwtVerifyToken, async function (req, res) {
    try {
        let ans = await methods.RequestBus.getAllUnconfirmedRoutes();
        let success = ans.success;
        let status = ans.status;
        let comment = "";

        let out = ans.about;
        if (out && out.length) {
            //not empty
            comment = "Successfully retrieved the data..!";
        }
        else {
            //empty
            status = 204; //No content
            comment = "Looks like there are no buses for verification..!";
        }

        res.json({
            'success': success,
            'about': { 'data': out, 'comment': comment },
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
});

//private/user/requestbus/getAllStopLocationsByID
router.post('/getAllStopLocationsByID', async function (req, res) {
    try {
        let rid = req.body.route_id;
        let res1 = await methods.BusInfo.getAllStopsOnTheRoute(rid);
        let about = res1.about;

        let onlyids = [];
        about.forEach(obj => {
            onlyids.push({ 'busstop_id': obj.busstop_id });
        });
        let res2 = await methods.BusInfo.getStopNameLocationsfromID(onlyids);
        let nameIDs = res2.about;

        var map = new Map();
        nameIDs.forEach(obj => {
            map[obj.busstop_id] = obj;
        });

        let data = [];

        onlyids.forEach(obj => {
            data.push(map[obj.busstop_id]);
        });

        res.json({
            'success': true,
            'about': { 'data': data, 'comment': null },
            'status': 200
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
});



module.exports = router;