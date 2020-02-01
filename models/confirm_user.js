module.exports = function (sequelize, DataTypes) {
    const ConfirmUser = sequelize
        .define('confirm_user', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
            },
            otp: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: true,
            }
        });

        ConfirmUser.associate = function (models) {
        models.confirm_user
            .belongsTo(models.passenger_details, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'id',
                },
            });
    };

    return ConfirmUser;
};