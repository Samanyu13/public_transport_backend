const express = require('express');
const router = express.Router();
const methods = require('./../../methods');

//public/dbEntry/addBusMaster
router.post('/addBusMaster', async (req, res) => {
    try {
        let result = await methods.Public.InsertDataFromCSV.addBusMaster();
        res.json({
            'success': result.success,
            'about': result.about,
            'status': result.status
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

//public/dbEntry/clearBusMaster
router.post('/clearBusMaster', async (req, res) => {
    try {
        let result = await methods.Public.DeleteDataFromCSV.clearBusMaster();
        console.log("Route: " + result.about);
        res.json({
            'success': result.success,
            'about': result.about,
            'status': result.status
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
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
            'about': result.about,
            'status': result.status
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

//public/dbEntry/clearRouteMaster
router.post('/clearRouteMaster', async (req, res) => {
    try {
        let result = await methods.Public.DeleteDataFromCSV.clearRouteMaster();
        console.log("Route: " + result.about);
        res.json({
            'success': result.success,
            'about': result.about,
            'status': result.status
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
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
            'about': result.about,
            'status': result.status
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

//public/dbEntry/clearRouteDetails
router.post('/clearRouteDetails', async (req, res) => {
    try {
        let result = await methods.Public.DeleteDataFromCSV.clearRouteDetails();
        console.log("Route: " + result.about);
        res.json({
            'success': result.success,
            'about': result.about,
            'status': result.status
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

//public/dbEntry/addAllDetails
/*
router.post('/addAllDetails', async (req, res) => {
    try {
        let result1 = await methods.Public.InsertDataFromCSV.addBusMaster();
        let result2 = await methods.Public.InsertDataFromCSV.addRouteMaster();
        if(result1.success && result2.success) {
            let result3 = await methods.Public.InsertDataFromCSV.addRouteDetails();
        }
        res.json({
            'success': true,
            'about': "Successfully entered all data tables..!",
            'status': 200
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});
*/

//public/dbEntry/clearAllDetails
router.post('/clearAllDetails', async (req, res) => {
    try {
        let result1 = await methods.Public.DeleteDataFromCSV.clearBusMaster();
        let result2 = await methods.Public.DeleteDataFromCSV.clearRouteMaster();

        res.json({
            'success': true,
            'about': "Successfully cleared all data",
            'status': 200
        });
    }
    catch(err) {
        console.log("Error-Routes: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

module.exports = router;