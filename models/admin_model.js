module.exports = function (sequelize, DataTypes) {
    const AdminModel = sequelize
        .define('admin_model', {
            employee_id: {
                type: DataTypes.STRING(10),
                primaryKey: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        });
    return AdminModel;
};
