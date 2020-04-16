const Authentication = {};

Authentication.User = require('./user');
Authentication.Employee = require('./employee');
Authentication.AdminAuth = require('./admin');

module.exports = Authentication;