module.exports = function (sequelize, DataTypes) {
    const PassengerCredentials = sequelize
        .define('passenger_credentials', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        });

        PassengerCredentials.associate = function (models) {
        models.passenger_credentials
            .belongsTo(models.passenger_details, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'id',
                },
            });
    };

    return PassengerCredentials;
};