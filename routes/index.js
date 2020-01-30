var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth', require('./auth'));
router.use('/private', require('./private'));
router.use('/common', require('./common'));

module.exports = router;
