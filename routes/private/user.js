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

//private/user/getConfirmedByUserID
router.post('/getConfirmedByUserID', async function (req, res) {
    try {
        let uid = req.body.user_id;
        let ans = await methods.RequestBus.liveRequestRouteIDsByUserID(uid);

        let inp = [];
        (ans.about).forEach(elem => {
            console.log(elem);
            inp.push({
                'route_id': elem.route_id,
                'time_frame': elem.time_frame
            });
        });

        let result = await methods.RequestBus.getAllConfirmedRoutesByRouteIDs(inp);

        //*****************************To attach route names ***********************
        let live_data = result.about;

        let arr = [];
        live_data.forEach(obj => {
            arr.push({ 'route_id': obj.route_id });
        });
        let names = await methods.BusInfo.getRouteNamesByIDs(arr);
        let r_names = names.about;

        var map = new Map();
        r_names.forEach(obj => {
            let data = obj.dataValues;
            map[data.route_id] = data.route_name;
        });

        let finalAns = [];
        live_data.forEach(obj => {
            let datum = {};
            datum.time = obj.time;
            datum.date = obj.date;
            datum.route_name = map[obj.route_id];
            finalAns.push(datum);
        });


        res.json({
            'success': result.success,
            'about': { 'data': finalAns, 'comment': 'Set of buses confirmed' },
            'status': result.status
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

//private/user/getProcessingByUserID
router.post('/getProcessingByUserID', async function (req, res) {
    try {
        let uid = req.body.user_id;
        let ans = await methods.RequestBus.liveRequestRouteIDsByUserID(uid);

        let inp = [];
        (ans.about).forEach(elem => {
            console.log(elem);
            inp.push({
                'route_id': elem.route_id,
                'time_frame': elem.time_frame
            });
        });

        let result = await methods.RequestBus.getAllUnConfirmedRoutesByRouteIDs(inp);

        //*****************************To attach route names ***********************
        let live_data = result.about;

        let arr = [];
        live_data.forEach(obj => {
            arr.push({ 'route_id': obj.route_id });
        });
        let names = await methods.BusInfo.getRouteNamesByIDs(arr);
        let r_names = names.about;

        var map = new Map();
        r_names.forEach(obj => {
            let data = obj.dataValues;
            map[data.route_id] = data.route_name;
        });

        let finalAns = [];
        live_data.forEach(obj => {
            let datum = {};
            datum.time_frame = obj.time_frame;
            datum.date = obj.date;
            datum.route_name = map[obj.route_id];
            finalAns.push(datum);
        });


        res.json({
            'success': result.success,
            'about': { 'data': finalAns, 'comment': 'Set of buses submitted for verification' },
            'status': result.status
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

//private/user/getNotSumbmittedByUserID
router.post('/getNotSumbmittedByUserID', async function (req, res) {
    try {
        let uid = req.body.user_id;
        let ans = await methods.RequestBus.liveRequestRouteIDsByUserID(uid);
        
        //*****************************To attach route names ***********************
        let live_data = ans.about;

        let arr = [];
        live_data.forEach(obj => {
            arr.push({ 'route_id': obj.route_id });
        });
        let names = await methods.BusInfo.getRouteNamesByIDs(arr);
        let r_names = names.about;

        var map = new Map();
        r_names.forEach(obj => {
            let data = obj.dataValues;
            map[data.route_id] = data.route_name;
        });

        let finalAns = [];
        live_data.forEach(obj => {
            let datum = {};
            datum.time_frame = obj.time_frame;
            datum.date = obj.date;
            datum.route_name = map[obj.route_id];
            finalAns.push(datum);
        });

        res.json({
            'success': ans.success,
            'about': { 'data': finalAns, 'comment': 'Set of buses requested by user' },
            'status': ans.status
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