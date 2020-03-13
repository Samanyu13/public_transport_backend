const models = require('./../../models');
const Op = require('sequelize').Op

let BusInfo = {};

/**
 * Adds a new bus to the set of live buses. This method requires 
 * the input of values --> busNo, regNo, busMake, employeeCode,
 * and routeNo.
 */
BusInfo.addToLiveBuses = async function (req, res) {
    try {
        let info = req;
        let data = {};
        data.bus_no = info.busNo;
        data.reg_no = info.regNo;
        data.bus_make = info.busMake;
        data.employee_code = info.employeeCode;
        data.route_no = info.routeNo;

        let newbus = await models.bus_live_status
            .create(data);

        return {
            'about': 'Added the bus ' + info.busNo + ' to live buses :)',
            'status': 200,
            'success': true
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        }
    }
}

/**
 * Returns the busstop names of the busstop IDs that were
 * passed onto the function as an array.
 */
BusInfo.getStopNamefromID = async function (req, res) {
    try {
        let arr = req;

        let ans = await models.busstop_master.findAll({
            where: {
                [Op.or]: arr
            },
            attributes: ['busstop']
        });
        ans = JSON.stringify(ans);
        ans = JSON.parse(ans);

        return {
            'about': ans,
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        return {
            'about': err,
            'status': 500,
            'success': false,
        }
    }
}

/**
 * Returns the set of all busstop IDs on a particular 
 * route along with its sequence no.
 */
BusInfo.getAllStopsOnTheRoute = async function (req, res) {
    try {
        let rid = req;

        let allIDs = await models.route_details.findAll({
            where: {
                route_id: rid
            },
            attributes: ['busstop_id']
        });
        //I have no idea if the retrieved set is sorted in
        // order of the busstops !!!
        return {
            'about': allIDs,
            'success': true,
            'status': 200
        }
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        }
    }
}

BusInfo.getRouteDetails = async function (req, res) {
    try {

    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        }
    }
}

module.exports = BusInfo;