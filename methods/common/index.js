const models = require('./../../models');
let Common = {};

Common.deleteAllPeopleData = async function (req, res) {
    try {
        let user = await models.passenger_details.destroy({
            where: {}
        });
        let emp_det = await models.employee_details.destroy({
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

module.exports = Common;