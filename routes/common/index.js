const express = require('express');
const methods = require('./../../methods');
const router = express.Router();

router.post('/deleteAll', async (req, res) => {
    try {
        let result = await methods.Common.deleteAllUsers();

        if(result.success == true) {
            res.json({
                'success': true,
                'about': "Deleted all User data",
                'status': 200
            });
        }
    }
    catch (err) {
        console.log("Error: " + err);
        res.json({
            'success': false,
            'about': err,
            'status': 100
        });
    }
})

module.exports = router;