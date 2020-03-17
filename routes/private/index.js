const express = require('express');
const router = express.Router();

//private/employee
router.use('/employee', require('./employee'));
//private/user
router.use('/user', require('./user'));

module.exports = router;