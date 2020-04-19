module.exports = function (sequelize, DataTypes) {
    const RequestBusesConfirmed = sequelize
        .define('request_buses_confirmed', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
            },
            route_id: {
                type: DataTypes.STRING(10),
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
            time: {
                type: DataTypes.TIME(),
                allowNull: false,
                unique: 'compositeIndex',
            },
        });



    return RequestBusesConfirmed;
};