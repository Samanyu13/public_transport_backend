const express = require('express');
const router = express.Router();
const methods = require('./../../methods');
const auth = require('./../../middleware/auth');

//private/employee/startBus
router.post('/startBus', auth.jwtVerifyToken, async function (req, res) {
    try {
        let data = JSON.stringify(req.body);
        data = JSON.parse(data);
        let info = {};
        info.busNo = data.busNo;
        info.regNo = data.regNo;
        info.busMake = data.busMake;
        info.employeeCode = data.employeeCode;
        info.routeNo = data.routeNo;

        let r1 = await methods.BusInfo.addToLiveBuses(info);
        
        if(r1.success) {
            
        }

    }
    catch (err) {
        console.log("Method-Error: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
})

module.exports = router;