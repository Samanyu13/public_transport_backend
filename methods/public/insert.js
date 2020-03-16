const models = require('../../models');
const csv = require('csv-parser');
const fs = require('fs');
let InsertDataFromCSV = {};

//paths to the csv files
const path_busMaster = __dirname + '/sheets/busstop_master.csv';
const path_routeMaster = __dirname + '/sheets/route_master.csv';
const path_routeDetails = __dirname + '/sheets/route_details.csv';

InsertDataFromCSV.addBusMaster = async function () {
    try {
        const obj = [];
        fs.createReadStream(path_busMaster)
            .pipe(csv())
            .on('data', (data) => obj.push(data))
            .on('end', async () => {
                await models.busstop_master.bulkCreate(obj);
            });

        return {
            'about': "Successfully entered BusMaster table..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

InsertDataFromCSV.addRouteMaster = async function () {
    try {
        const obj = [];
        fs.createReadStream(path_routeMaster)
            .pipe(csv())
            .on('data', (data) => obj.push(data))
            .on('end', async () => {
                await models.route_master.bulkCreate(obj);
            });

        return {
            'about': "Successfully entered RouteMaster table..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

InsertDataFromCSV.addRouteDetails = async function () {
    try {
        const obj = [];
        fs.createReadStream(path_routeDetails)
            .pipe(csv())
            .on('data', (data) => obj.push(data))
            .on('end', async () => {
                await models.route_details.bulkCreate(obj);
            });

        return {
            'about': "Successfully entered RouteDetails table..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

module.exports = InsertDataFromCSV;