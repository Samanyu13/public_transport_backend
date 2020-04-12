module.exports = function (sequelize, DataTypes) {
    const PassengerDetails = sequelize
        .define('passenger_details', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
            },
            mobile_number: {
                type: DataTypes.STRING(13),
                allowNull: false,
                unique: true,
            },
            username: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            verified: {
                type: DataTypes.BOOLEAN(),
                allowNull: false,
            },
        });

        PassengerDetails.associate = function (models) {
            models.passenger_details
                .hasMany(models.bus_request_live, {
                    onDelete: 'CASCADE',
                    foreignKey: {
                        name: 'user_id'
                    }
                });
        };

    return PassengerDetails;
};