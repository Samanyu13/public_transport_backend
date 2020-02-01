var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//auth
router.use('/auth', require('./auth'));
//private
router.use('/private', require('./private'));
//common
router.use('/common', require('./common'));

module.exports = router;
