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

        if (ans.success) {
            let nextCheck = {};
            nextCheck.bus_request_id = ans.about;
            nextCheck.user_id = data.user_id;

            //check if the user is has already applied for this route
            let dupl = await methods.RequestBus.isUserDuplicateEntry(nextCheck);

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

module.exports = router;