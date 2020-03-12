const models = require('./../../models');
let BusInfo = {};

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

module.exports = BusInfo;