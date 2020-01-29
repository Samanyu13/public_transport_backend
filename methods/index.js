const methods = {};

methods.Authentication = require('./auth');
methods.EmailConfirmation = require('./mail/send');

module.exports = methods;