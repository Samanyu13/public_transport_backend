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
            address: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
        });



    return EmployeeDetails;
};