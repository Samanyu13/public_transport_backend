const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

//public/dbEntry/addBusMaster
router.post('/addBusMaster', async (req, res) => {
    try {
        let result = await methods.Public.InsertDataFromCSV.addBusMaster();
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


//public/dbEntry/addRouteMaster
router.post('/addRouteMaster', async (req, res) => {
    try {
        let result = await methods.Public.InsertDataFromCSV.addRouteMaster();
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

//public/dbEntry/addRouteDetails
router.post('/addRouteDetails', async (req, res) => {
    try {
        let result = await methods.Public.InsertDataFromCSV.addRouteDetails();
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

//public/dbEntry/addAllDetails
//dont use this route - still under maintenance..!!!
router.post('/addAllDetails', async (req, res) => {
    try {
        let result1 = await methods.Public.InsertDataFromCSV.addBusMaster();
        let result2 = await methods.Public.InsertDataFromCSV.addRouteMaster();
        if (result1.success && result2.success) {
            let result3 = await methods.Public.InsertDataFromCSV.addRouteDetails();
        }
        res.json({
            'success': true,
            'about': { 'data': null, 'comment': "Successfully entered all data tables..!" },
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

module.exports = router;