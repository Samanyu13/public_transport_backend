const models = require('../../models');
const csv = require('csv-parser');
const fs = require('fs');
let DeleteDataFromCSV = {};


DeleteDataFromCSV.clearBusMaster = async function () {
    try {
        let result = await models.busstop_master.destroy({
            where: {}
        });
        console.log(result + " rows deleted from BusMaster..!");

        return {
            'about': "Successfully cleared BusMaster..!",
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

DeleteDataFromCSV.clearRouteMaster = async function () {
    try {
        let result = await models.route_master.destroy({
            where: {}
        });
        console.log(result + " rows deleted from RouteMaster..!");

        return {
            'about': "Successfully cleared RouteMaster..!",
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

DeleteDataFromCSV.clearRouteDetails = async function () {
    try {
        let result = await models.route_details.destroy({
            where: {}
        });
        console.log(result + " rows deleted from RouteDetails..!");

        return {
            'about': "Successfully cleared RouteDetails..!",
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

module.exports = DeleteDataFromCSV;