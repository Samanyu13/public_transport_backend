module.exports = function (sequelize, DataTypes) {
    const EmployeeDetails = sequelize
        .define('employee_details', {
            id: {
                type: DataTypes.INTEGER(),
                primaryKey: true,
                autoIncrement: true,
            },
            employee_id: {
                type: DataTypes.STRING(10),
                allowNull: false,
                unique: true,
            },
            mobile_number: {
                type: DataTypes.STRING(13),
                allowNull: false,
                unique: true,
            },
            address: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
        });

    EmployeeDetails.associate = function (models) {
        models.employee_details
            .belongsTo(models.employee_credentials, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'employee_id',
                },
            });
    };

    return EmployeeDetails;
};