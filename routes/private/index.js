const express = require('express');
const router = express.Router();

//private/employee
router.use('/employee', require('./employee'));

module.exports = router;