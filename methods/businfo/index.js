const models = require('./../../models');
const Op = require('sequelize').Op;
const { sequelize } = require('./../../models');
const { QueryTypes } = require('sequelize');

let BusInfo = {};

/**
 * Adds a new bus to the set of live buses. This method requires 
 * the input of values --> busNo, regNo, busMake, employeeCode,
 * and routeNo.
 */
BusInfo.addToLiveBuses = async function (req) {
    try {
        let info = req;
        let data = {};
        data.bus_no = info.busNo;
        data.reg_no = info.regNo;
        data.bus_make = info.busMake;
        data.employee_code = info.employeeCode;
        data.route_no = info.routeNo;

        await models.bus_live_status
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
        };
    }
}

/**
 * Returns the busstop names of the busstop IDs that were
 * passed onto the function as an array.
 */
BusInfo.getStopNamefromID = async function (req) {
    try {
        let arr = req;

        let ans = await models.busstop_master.findAll({
            where: {
                [Op.or]: arr
            },
            attributes: ['busstop', 'busstop_id']
        });

        let data = [];
        ans.forEach(obj => {
            data.push(obj.dataValues);
        });
        return {
            'about': data,
            'status': 200,
            'success': true
        };
    }
    catch (err) {
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Returns the set of all busstop IDs on a particular 
 * route along with its sequence no.
 */
BusInfo.getAllStopsOnTheRoute = async function (req) {
    try {
        function sortByProperty(property) {
            return function (a, b) {
                if (a[property] > b[property])
                    return 1;
                else if (a[property] < b[property])
                    return -1;

                return 0;
            }
        }

        let rid = req;

        let allIDs = await models.route_details.findAll({
            where: {
                route_id: rid
            },
            attributes: ['busstop_id', 'id']
        });

        console.log(allIDs);
        let data = [];
        allIDs.forEach(element => {
            data.push(element.dataValues);
        });

        data.sort(sortByProperty("id"));
        console.log(data);

        return {
            'about': data,
            'success': true,
            'status': 200
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Returns the details of the live bus oresponding to the 
 * provided employeeCde
 */
BusInfo.getLiveBusByEmpID = async function (req) {
    try {
        let live = await models.bus_live_status.findOne({
            where: {
                employee_code: req
            }
        });

        if (live == null) {
            return {
                'about': 'Employee code mismatch..:/',
                'status': 500,
                'success': false,
            };
        }
        else {
            return {
                'about': live,
                'status': 200,
                'success': true,
            };
        }
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Removes the bus with the given busNo from the list of 
 * live status ans logs the info to bus_log.
 */
BusInfo.removeFromLiveAndAddToLog = async function (req) {
    try {
        let busNo = req.bus_no;

        let seq = await sequelize.transaction(async function (t) {
            await models.bus_live_status.destroy({
                where: {
                    bus_no: busNo
                }, transaction: t
            });

            await models.bus_log.create(req, { transaction: t });

        });
        console.log("SEQ: " + JSON.stringify(seq));
        return {
            'about': "Successfully removed from live buses and logged..:)",
            'status': 200,
            'success': true,
        };

    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Returns the stopID when the name is provided.
 */
BusInfo.getStopIDByName = async function (info) {
    try {
        let stopid = await models.busstop_master.findOne({
            where: {
                busstop: info
            },
        });

        if (stopid == null) {
            return {
                'about': "Invalid StopName :/",
                'status': 404,
                'success': false
            };
        }

        return {
            'about': stopid.busstop_id,
            'status': 200,
            'success': true,
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Returns the details of all the live routes such that they are 
 * in a direction from the source to destination.
 */
BusInfo.retrieveLiveRouteIDsFromStops = async function (info) {
    try {
        console.log(info);
        const query = `
                        SELECT R.route_id, R.route_name, B.bus_no, B.employee_code, B.reg_no, B.bus_make
                        FROM route_masters AS R , bus_live_statuses AS B 
                        WHERE R.route_id = B.route_no AND R.route_id IN
                            (SELECT route_id FROM route_details as x 
                                WHERE 
                                    x.busstop_id = $startStop AND x.route_id IN 
                                    (SELECT route_id FROM route_details as y, bus_live_statuses AS z 
                                    WHERE y.busstop_id = $endStop AND x.id < y.id AND y.route_id = z.route_no))
                       `
        let routeIDs = await models.sequelize.query(query,
            {
                bind: {
                    startStop: info.from,
                    endStop: info.to
                },
                type: QueryTypes.SELECT
            });
        console.log(routeIDs)
        return {
            'about': routeIDs,
            'status': 200,
            'success': true,
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Returns the details of all the routes such that they are 
 * in a direction from the source to destination.
 */
BusInfo.retrieveAllRouteIDsFromStops = async function (info) {
    try {
        console.log(info);
        const query = `
                        SELECT R.route_id, R.route_name 
                        FROM route_masters AS R 
                        WHERE R.route_id IN
                            (SELECT route_id FROM route_details as x 
                                WHERE 
                                    x.busstop_id = $startStop AND x.route_id IN 
                                    (SELECT route_id FROM route_details as y  
                                    WHERE y.busstop_id = $endStop AND x.id < y.id))
                       `
        let routeIDs = await models.sequelize.query(query,
            {
                bind: {
                    startStop: info.from,
                    endStop: info.to
                },
                type: QueryTypes.SELECT
            });
        console.log(routeIDs)
        return {
            'about': routeIDs,
            'status': 200,
            'success': true,
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}
/**
 * Retrieve route data from oute Ids, given an array 
 * of route IDs
 */
BusInfo.getRouteDataFromIDs = async function (info) {
    try {

        let routeData = await models.route_master.findAll({
            where: {
                [Op.or]: info
            },
            attributes: ['route_id', 'route_name']
        });
        routeData = JSON.stringify(routeData);
        routeData = JSON.parse(routeData);
        return {
            'about': routeData,
            'status': 200,
            'success': true,
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Retrieves the set of all busstop names
 */
BusInfo.getAllBusStopNames = async function () {
    try {
        let busData = await models.busstop_master.findAll({
            where: {},
            attributes: ['busstop']
        });

        busData = JSON.stringify(busData);
        busData = JSON.parse(busData);
        return {
            'about': busData,
            'status': 200,
            'success': true,
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

/**
 * Returns the Route_Name when the routeID is provided.
 */
BusInfo.getRouteNameByID = async function (info) {
    try {
        let id = await models.route_master.findOne({
            where: {
                route_id: info
            },
        });

        if (id == null) {
            return {
                'about': "Invalid RouteID :/",
                'status': 404,
                'success': false
            };
        }

        return {
            'about': stopid.route_name,
            'status': 200,
            'success': true,
        };
    }
    catch (err) {
        console.log('Error-Methods: ' + err);
        return {
            'about': err,
            'status': 500,
            'success': false,
        };
    }
}

module.exports = BusInfo;
