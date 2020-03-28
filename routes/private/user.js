const express = require('express');
const router = express.Router();
const methods = require('./../../methods');
// const io = require('./../../node_modules/socket.io-client/dist/socket.io');
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
        let routeDetails = await methods.BusInfo.retrieveLiveRouteIDsFromStops(data);

        console.log(routeDetails.about);

        res.json({
            'success': true,
            'about': { 'data': routeDetails.about, 'comment': null },
            'status': 200
        });

        // let socket = io();
        // socket
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