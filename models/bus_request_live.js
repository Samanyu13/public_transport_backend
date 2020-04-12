module.exports = function (sequelize, DataTypes) {
    const BusRequestLive = sequelize
        .define('bus_request_live', {
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

    return BusRequestLive;
};