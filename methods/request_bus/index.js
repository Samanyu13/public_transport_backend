const RequestBus = {};
const models = require('./../../models');
const { sequelize } = require('./../../models');
const Op = require('sequelize').Op;

/**
 * Checks if the given record exists in the database. 
 * If it exists, returns the id of the record. 
 * Else returns null
 */
RequestBus.checkRecordExistance = async function (info) {
    try {
        let data = [];
        let success = false;
        let about = null;
        data.push({ 'route_id': info.route_id });
        data.push({ 'date': info.date });
        data.push({ 'time_frame': info.time_frame });

        let result = await models.bus_request_details.findOne({
            where: {
                [Op.and]: data
            }
        });

        if (result != null) {
            about = result.id;
            success = true;
        }

        return {
            'about': about,
            'status': 200,
            'success': success
        }
    }
    catch (err) {
        console.log("Error-Methods-checkRecordExistance: " + err);
        return {
            'about': "The check failed:/l..!",
            'status': 500,
            'success': false
        }
    }
}
/**
 * Adds a new record to the bus_request_details and adds 
 * it to the log
 */
RequestBus.addNewRecord = async function (info) {
    try {
        await sequelize.transaction(async function (t) {
            let details = {};
            details.date = info.date;
            details.time_frame = info.time_frame;
            details.route_id = info.route_id;
            details.count = info.count;

            let res_1 = await models.bus_request_details
                .create(details, { transaction: t });

            let livelog = {};
            livelog.bus_request_id = res_1.id;
            livelog.route_id = info.route_id;
            livelog.user_id = info.user_id;

            await models.bus_request_live
                .create(livelog, { transaction: t });
        });

        return {
            'about': " Request Successful..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods-addNewRecord: " + err);
        return {
            'about': "The update failed..!",
            'status': 500,
            'success': false
        }
    }
}
/**
 * Updates the existing bus_request_details by the given count 
 * and adds it the log
 */
RequestBus.updateExistingRecord = async function (info) {
    try {
        await sequelize.transaction(async function (t) {
            let bus_request_id = info.bus_request_id;

            models.bus_request_details
                .increment('count', { by: info.count, where: { id: bus_request_id } });

            let livelog = {};
            livelog.bus_request_id = info.bus_request_id;
            livelog.route_id = info.route_id;
            livelog.user_id = info.user_id;

            await models.bus_request_live
                .create(livelog, { transaction: t });
        });

        return {
            'about': "Bus Request successfully added..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods-updateExistingRecord: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

/**
 * Checks if the user already has a live entry in the 
 * corresponding route. If he already has one, it returns true. 
 * Else, false is returned.
 */
RequestBus.isUserDuplicateEntry = async function (info) {
    try {
        let data = [];
        let about = null;
        let success = false;
        data.push({ 'bus_request_id': info.bus_request_id });
        data.push({ 'user_id': info.user_id });

        let result = await models.bus_request_live.findOne({
            where: {
                [Op.and]: data
            }
        });

        if (result != null) {
            success = true;
            about = "Looks like you've already applied for the same..!";
        }

        return {
            'about': about,
            'status': 200,
            'success': success
        }
    }
    catch (err) {
        console.log("Error-Methods-isUserDuplicateEntry: " + err);
        return {
            'about': "Check for duplicate entry failed..!",
            'status': 500,
            'success': false
        }
    }
}

/**
 * Checks if a route has exceeded the threshold
 */
RequestBus.ifThresholdExceed = async function (info) {
    const THRESHOLD = 10;
    try {
        let about = null;
        let success = false;
        let ans = models.bus_request_details
            .findOne({
                where: {
                    id: info,
                    count: {
                        [Op.gte]: THRESHOLD
                    }
                }
            });

        if (ans != null) {
            success = true;
            about = "Threshold reached..! Now, we'll be able to send request for the bus..!";
        }

        return {
            'about': about,
            'status': 200,
            'success': success
        }
    }
    catch (err) {
        console.log("Error-Methods-ifThresholdExceed: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

/**
 * Insert route data for verification
 */
RequestBus.insertToBusesForVerification = async function (info) {
    try {
        let data = {};
        data.time_frame = info.time_frame;
        data.date = info.date;
        data.route_id = info.route_id;
        let res = await models.request_buses_for_verification.create(data);
        console.log("RES of insertion: " + JSON.stringify(res));

        return {
            'about': "Route data submitted for final verification..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods-insertToBusesForVerification: " + err);
        let about = err;
        let status = 500;
        if (err.name == 'SequelizeUniqueConstraintError') {
            about = "This particular date-route-time_frame has already been added for verification..:)";
            status = 409;
        }
        return {
            'about': about,
            'status': status,
            'success': false
        }
    }
}

/**
 * Get the route data submitted for verification by ID
 */
RequestBus.getUnconfirmedRouteByID = async function (info) {
    try {
        let about = null;
        let success = false;
        let ans = await models.request_buses_for_verification
            .findOne({
                where: {
                    id: info
                }
            });

        if (ans != null) {
            about = ans;
            success = true;
        }
        else {
            about = "Could'nt find the corresponding route data:/..!"
        }

        return {
            'about': about,
            'status': 200,
            'success': success
        }
    }
    catch (err) {
        console.log("Error-Methods-getUnconfirmedRouteByID: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

/**
 * Confirm the bus submitted for verification
 */
RequestBus.confirmTrip = async function (info) {
    try {

        let data = {};
        data.time_frame = info.time_frame;
        data.date = info.date;
        data.route_id = info.route_id;

        await models.request_buses_confirmed.create(data);

        return {
            'about': about,
            'status': 200,
            'success': success
        }
    }
    catch (err) {
        console.log("Error-Methods-confirmTrip: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

/**
 * Get the set of all routes submitted for verification
 */
RequestBus.getAllUnconfirmedRoutes = async function (info) {
    try {
        let ans = await models.request_buses_for_verification.findAll({
            where: {}
        });
        console.log("ANS: " + ans);
        return {
            'about': ans,
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods-confirmTrip: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

module.exports = RequestBus;