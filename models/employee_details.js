module.exports = function (sequelize, DataTypes) {
    const EmployeeDetails = sequelize
        .define('employee_details', {
            employee_id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
                allowNull: false,
                unique: true,
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



    return EmployeeDetails;
};