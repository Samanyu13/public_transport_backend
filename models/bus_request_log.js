module.exports = function (sequelize, DataTypes) {
    const BusRequestLog = sequelize
        .define('bus_request_log', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
            },
            bus_request_id: {
                type: DataTypes.INTEGER(),
                unique: true,
            },
            user_id: {
                type: DataTypes.INTEGER(),
                allowNull: false
            },
            route_id: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
        });

    return BusRequestLog;
};