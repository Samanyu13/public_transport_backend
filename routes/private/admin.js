const express = require('express');
const router = express.Router();

//private/admin/dashboard
router.get('/dashboard', function (req, res) {
    res.render('private/admin/dashboard', { title: 'Express' });
});

//private/admin/toVerify
router.get('/toVerify', function (req, res) {
    res.render('private/admin/toverify', { title: 'Express' });
});

//private/admin/confirmed
router.get('/confirmed', function (req, res) {
    res.render('private/admin/confirmed', { title: 'Express' });
});

module.exports = router;