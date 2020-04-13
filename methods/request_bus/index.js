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
        console.log("Error-Methods: " + err);
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
        let seq = await sequelize.transaction(async function (t) {
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

        console.log("Transaction Output: " + seq);

        return {
            'about': " Request Successful..!",
            'status': 200,
            'success': true
        }
    }
    catch (err) {
        console.log("Error-Methods: " + err);
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
        let seq = await sequelize.transaction(async function (t) {
            let bus_request_id = info.bus_request_id;

            let ans = models.bus_request_details
                .increment('count', { by: info.count, where: { id: bus_request_id } });

            let livelog = {};
            livelog.bus_request_id = info.bus_request_id;
            livelog.route_id = info.route_id;
            livelog.user_id = info.user_id;

            await models.bus_request_live
                .create(livelog, { transaction: t });
        });

        console.log("Transaction Output: " + seq);

        return {
            'about': "Request Successful..!",
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
        console.log("Error-Methods: " + err);
        return {
            'about': "Check for duplicate entry failed..!",
            'status': 500,
            'success': false
        }
    }
}

RequestBus.ifThresholdExceed = async function (info) {
    const THRESHOLD = 10;
    try {
        let about = null;
        let success = false;
        let ans = models.bus_request_details
            .findOne({
                where: {
                    id: info,
                    [Op.gte]: THRESHOLD
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
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

RequestBus.insertToBusesForVerification = async function (info) {
    try {

        let data = {};
        data.time_frame = info.time_frame;
        data.date = info.date;
        data.route_id = info.route_id;

        await models.request_buses_for_verification.create(data);

        return {
            'about': "Route data submitted for final verification..!",
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

RequestBus.getUnconfirmedBusByID = async function (info) {
    try {
        let about = null;
        let success = false;
        let ans = await models.request_buses_for_verification
        .findOne({
            where: {
                id: info
            }
        });

        if(ans != null) {
            console.log("ITHAANO: " + ans);
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
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

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
        console.log("Error-Methods: " + err);
        return {
            'about': err,
            'status': 500,
            'success': false
        }
    }
}

module.exports = RequestBus;