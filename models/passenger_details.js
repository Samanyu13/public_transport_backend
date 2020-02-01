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
            first_name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING(20),
                allowNull: false,
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

    return PassengerDetails;
};