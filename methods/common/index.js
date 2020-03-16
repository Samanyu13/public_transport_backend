const models = require('./../../models');
let Common = {};

Common.deleteAllPeopleData = async function () {
    try {
        await models.passenger_details.destroy({
            where: {}
        });
        await models.employee_details.destroy({
            where: {}
        });
        return {
            'about': "All the tables deleted..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
        return {
            'about': "Delete unsuccessful..!",
            'status': 500,
            'success': false
        }
    }
}

Common.clearBusMaster = async function () {
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

Common.clearRouteMaster = async function () {
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

Common.clearRouteDetails = async function () {
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

module.exports = Common;