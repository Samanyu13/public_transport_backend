const methods = {};

methods.Authentication = require('./auth');
methods.Private = require('./private');
methods.Common = require('./common');
methods.EmailConfirmation = require('./mail/send');

module.exports = methods;