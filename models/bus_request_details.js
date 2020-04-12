module.exports = function (sequelize, DataTypes) {
    const BusRequestDetails = sequelize
        .define('bus_request_details', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
            },
            date: {
                type: DataTypes.DATE(),
                unique: 'compositeIndex',
            },
            time_frame: {
                type: DataTypes.INTEGER(),
                unique: 'compositeIndex',
            },
            route_id: {
                type: DataTypes.STRING(10),
                unique: 'compositeIndex',
            },
            count: {
                type: DataTypes.INTEGER(),
                allowNull: false,
            },
        });

    BusRequestDetails.associate = function (models) {
        models.bus_request_details
            .hasMany(models.bus_request_live, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'bus_request_id'
                }
            });
    };

    return BusRequestDetails;
};