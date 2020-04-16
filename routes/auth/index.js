const express = require('express');
const router = express.Router();

//auth/user
router.use('/user', require('./user'));

//auth/employee
router.use('/employee', require('./employee'));

//auth/adminAuth
router.use('/adminAuth', require('./admin'));

module.exports = router;