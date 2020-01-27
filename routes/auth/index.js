const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    console.log(toString(req.body));
    res.json({
        status: "Hello"
    });
});

module.exports = router;