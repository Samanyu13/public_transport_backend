const models = require('./../../models');
const Op = require('sequelize').Op
const { sequelize } = require('./../../models');

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
        }
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
BusInfo.getAllStopsOnTheRoute = async function (req) {
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
            }
        }
        else {
            return {
                'about': live,
                'status': 200,
                'success': true,
            }
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

/**
 * Removes the bus with the given busNo from the list of 
 * live status ans logs the info to bus_log.
 */
BusInfo.removeFromLiveAndAddToLog = async function (req) {
    try {
        let busNo = req.bus_no;
        console.log("REQQQ: " + JSON.stringify(req));

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
        }
    }
}

// BusInfo.getRouteDetails = async function (req) {
//     try {

//     }
//     catch (err) {
//         console.log('Error-Methods: ' + err);
//         return {
//             'about': err,
//             'status': 500,
//             'success': false,
//         }
//     }
// }

module.exports = BusInfo;