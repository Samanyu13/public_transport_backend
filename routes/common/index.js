const express = require('express');
const methods = require('./../../methods');
const router = express.Router();

//common/clearAllPeopleData
router.post('/clearAllPeopleData', async (req, res) => {
    try {
        let result = await methods.Common.deleteAllPeopleData();

        res.json({
            'success': result.success,
            'about': { 'data': null, 'comment': result.about },
            'status': result.status
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

//common/clearAllBusData
router.post('/clearAllBusData', async (req, res) => {
    try {
        let result1 = await methods.Common.clearBusMaster();
        let result2 = await methods.Common.clearRouteMaster();

        res.json({
            'success': true,
            'about': { 'data': null, 'comment': "Successfully cleared all data" },
            'status': 200
        });
    }
    catch (err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

///common/clearBusMaster
router.post('/clearBusMaster', async (req, res) => {
    try {
        let result = await methods.Common.clearBusMaster();
        console.log("Route: " + result.about);
        res.json({
            'success': result.success,
            'about': { 'data': null, 'comment': result.about },
            'status': result.status
        });
    }
    catch (err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

//common/clearRouteMaster
router.post('/clearRouteMaster', async (req, res) => {
    try {
        let result = await methods.Common.clearRouteMaster();
        console.log("Route: " + result.about);
        res.json({
            'success': result.success,
            'about': { 'data': null, 'comment': result.about },
            'status': result.status
        });
    }
    catch (err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

//common/clearRouteDetails
router.post('/clearRouteDetails', async (req, res) => {
    try {
        let result = await methods.Common.clearRouteDetails();
        console.log("Route: " + result.about);
        res.json({
            'success': result.success,
            'about': { 'data': null, 'comment': result.about },
            'status': result.status
        });
    }
    catch (err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': { 'data': null, 'comment': err },
            'status': 500
        });
    }
});

module.exports = router;