const express = require('express');
const router = express.Router();
const methods = require('./../../methods');
// const auth = require('./../../middleware/auth');

//private/user/retrieveAllLiveRoutes
router.post('/retrieveAllLiveRoutes', async function (req, res) {
    try {
        //req.decoded - details
        console.log("DECODED: " + JSON.stringify(req.decoded));
        let data = {};
        let f = await methods.BusInfo.getStopIDByName(req.body.from);
        let t = await methods.BusInfo.getStopIDByName(req.body.to);

        data.from = f.about;
        data.to = t.about;
        // console.log(JSON.stringify(t));
        let routeDetails = await methods.BusInfo.retrieveLiveRouteIDsFromStops(data);
        // console.log(routeDetails.about);
        let info = routeDetails.about;
        let tosend = await methods.BusInfo.getRouteDataFromIDs(info);
        console.log(tosend.about);

        res.json({
            'success': true,
            'about': { 'data': null, 'comment': tosend.about },
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