module.exports = function (sequelize, DataTypes) {
    const PassengerCredentials = sequelize
        .define('passenger_credentials', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
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

    return PassengerCredentials;
};