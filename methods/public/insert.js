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
                for (let i = 0; i < obj.length; i++) {
                    let busMaster = await models.busstop_master.create(obj[i]);
                }
            });

        return {
            'about': "Successfully entered BusMaster table..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
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
                for (let i = 0; i < obj.length; i++) {
                    let routeMaster = await models.route_master.create(obj[i]);
                }
            });

        return {
            'about': "Successfully entered RouteMaster table..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
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
                for (let i = 0; i < obj.length; i++) {
                    let routeDetails = await models.route_details.create(obj[i]);
                }
            });

        return {
            'about': "Successfully entered RouteDetails table..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

module.exports = InsertDataFromCSV;