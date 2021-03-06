var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

//auth
router.use('/auth', require('./auth'));

//private
router.use('/private', require('./private'));

//common
router.use('/common', require('./common'));

//public
router.use('/public', require('./public'));

//error
router.get('/error', function (req, res) {
  res.render('error', { title: 'ERROR' });
});

module.exports = router;
