module.exports = function (sequelize, DataTypes) {
    const ConfirmEmployee = sequelize
        .define('confirm_employee', {
            employee_id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
            },
            otp: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: true,
            }
        });

        ConfirmEmployee.associate = function (models) {
        models.confirm_employee
            .belongsTo(models.employee_details, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'employee_id',
                },
            });
    };

    return ConfirmEmployee;
};