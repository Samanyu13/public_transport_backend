//public route
const express = require("express");
const router = express.Router();

//public/dbEntry/
router.use('/dbEntry', require('./db_entry'));

module.exports = router;
