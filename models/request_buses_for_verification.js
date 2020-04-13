module.exports = function (sequelize, DataTypes) {
    const RequestBusesForVerification = sequelize
        .define('request_buses_for_verification', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
            },
            route_id: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: 'compositeIndex',
            },
            time_frame: {
                type: DataTypes.INTEGER(),
                allowNull: false,
                unique: 'compositeIndex',
            },
            date: {
                type: DataTypes.DATE(),
                allowNull: false,
                unique: 'compositeIndex',
            },
        });



    return RequestBusesForVerification;
};