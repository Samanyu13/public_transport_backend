const express = require('express');
const router = express.Router();

//auth/user
router.use('/user', require('./user'));

module.exports = router;