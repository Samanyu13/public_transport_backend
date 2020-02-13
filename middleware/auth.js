const jwt = require('jsonwebtoken');
const config = require('../config/api.json');
const secret = config.API_SECRET;
var auth = {};

auth.jwtVerifyToken = async function (req, res, next) {
    console.log(req.headers);
    const token = req.headers['x-access-token'];
    if (!token) {
        console.log("No token..! :/");
        return ({
            'status': 403,
            'success': false,
            'about': 'No token provided.'
        });
    }

    return jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            console.log("Failed verification..!");
            return ({
                'status': 500,
                'success': false,
                'about': 'Failed verification..! :/'
            });
        }

        // if everything good, save to request for use in other routes
        console.log('Everything looking good..!');
        req.decoded = decoded;
        return next();
    });
}

module.exports = auth;