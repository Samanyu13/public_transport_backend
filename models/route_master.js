module.exports = function (sequelize, DataTypes) {
    const RouteMaster = sequelize
        .define('route_master', {
            route_id: {
                type: DataTypes.STRING(10),
                allowNull: false,
                primaryKey: true,
            },
            route_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        });

    RouteMaster.associate = function (models) {
        models.route_master
            .hasMany(models.route_details, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'route_id'
                }
            });
    };

    RouteMaster.associate = function (models) {
        models.route_master
            .hasMany(models.bus_request_details, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'route_id'
                }
            });
    };

    RouteMaster.associate = function (models) {
        models.route_master
            .hasMany(models.bus_request_live, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'route_id'
                }
            });
    };

    return RouteMaster;
};