//public route
const express = require("express");
const router = express.Router();

router.use('/db_entry', require('./db_entry'));
router.use('/employee', require('./employee'));

module.exports = router;
