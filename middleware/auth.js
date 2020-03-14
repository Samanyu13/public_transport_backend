const jwt = require('jsonwebtoken');
const config = require('../config/api.json');
const secret = config.API_SECRET;
var auth = {};

auth.jwtVerifyToken = async function (req, res, next) {
    console.log(req.headers);
    const token = req.headers['x-access-token'];
    if (!token) {
        console.log("No token..! :/");
        return res.json({
            'status': 403,
            'success': false,
            'about': { 'comment': 'No token provided.', 'data': null }
        });
    }

    return jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            console.log("Failed verification..!");
            return res.json({
                'status': 500,
                'success': false,
                'about': { 'comment': 'Failed verification..! :/', 'data': null }
            });
        }

        // if everything good, save to request for use in other routes
        console.log('Everything looking good..!');
        req.decoded = decoded;
        return next();
    });
}

module.exports = auth;