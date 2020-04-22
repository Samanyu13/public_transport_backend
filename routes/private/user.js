const express = require('express');
const router = express.Router();
const methods = require('./../../methods');
// const io = require('./../../node_modules/socket.io-client/dist/socket.io');
// const auth = require('./../../middleware/auth');

router.use('/requestbus', require('./request_bus'));

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

//private/user/retrieveAllRoutes
router.post('/retrieveAllRoutes', async function (req, res) {
    try {
        //req.decoded - details
        console.log("DECODED: " + JSON.stringify(req.decoded));
        let data = {};
        let f = await methods.BusInfo.getStopIDByName(req.body.from);
        let t = await methods.BusInfo.getStopIDByName(req.body.to);

        data.from = f.about;
        data.to = t.about;
        let routeDetails = await methods.BusInfo.retrieveAllRouteIDsFromStops(data);

        console.log(routeDetails.about);

        res.json({
            'success': true,
            'about': { 'data': routeDetails.about, 'comment': null },
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

//private/user/getAllBusStopNames
router.get('/getAllBusStopNames', async function (req, res) {
    try {
        let alldata = await methods.BusInfo.getAllBusStopNames();
        console.log(alldata.about);

        res.json({
            'success': true,
            'about': { 'data': alldata.about, 'comment': null },
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

//private/user/getAllStopsByID
router.post('/getAllStopsByID', async function (req, res) {
    try {
        let rid = req.body.route_id;
        let res1 = await methods.BusInfo.getAllStopsOnTheRoute(rid);
        let about = res1.about;

        let onlyids = [];
        about.forEach(obj => {
            onlyids.push({ 'busstop_id': obj.busstop_id });
        });
        let res2 = await methods.BusInfo.getStopNamesfromID(onlyids);
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