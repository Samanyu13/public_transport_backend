const methods = {};

methods.Authentication = require('./auth');
methods.Private = require('./private');
methods.Common = require('./common');
methods.EmailConfirmation = require('./mail/send');
methods.Public = require('./public');
methods.BusInfo = require('./businfo');
methods.RequestBus = require('./request_bus');

module.exports = methods;