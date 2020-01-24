module.exports = function (sequelize, DataTypes) {
    const EmployeeCredentials = sequelize
        .define('employee_credentials', {
            employee_id: {
                type: DataTypes.STRING(10),
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

    EmployeeCredentials.associate = function (models) {
        models.employee_credentials
            .belongsTo(models.employee_details, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'employee_id',
                },
            });
    };

    return EmployeeCredentials;
};