const express = require('express');
const methods = require('./../../methods');
const router = express.Router();


router.post('/deleteAllPeopleData', async (req, res) => {
    try {
        let result = await methods.Common.deleteAllPeopleData();

            res.json({
                'success': result.success,
                'about': result.about,
                'status': result.status
            });
    }
    catch (err) {
        console.log("Error: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 500
        });
    }
});

module.exports = router;