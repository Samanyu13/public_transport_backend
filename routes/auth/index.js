const express = require('express');
const router = express.Router();

//auth/user
router.use('/user', require('./user'));

//auth/employee
router.use('/employee', require('./employee'));

module.exports = router;