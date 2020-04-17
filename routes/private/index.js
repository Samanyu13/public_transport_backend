const express = require('express');
const router = express.Router();

//private/employee
router.use('/employee', require('./employee'));
//private/user
router.use('/user', require('./user'));

//private/admin
router.use('/admin', require('./admin'));

module.exports = router;