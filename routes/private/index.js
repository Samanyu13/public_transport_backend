const express = require('express');
const router = express.Router();

router.use('/employee', require('./employee'));

module.exports = router;