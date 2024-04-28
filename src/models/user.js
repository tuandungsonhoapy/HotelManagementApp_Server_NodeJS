'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.Group);
            User.hasMany(models.Invoice);
            User.hasOne(models.Employee);
            User.hasOne(models.Customer);
        }
    }
    User.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            avatar: DataTypes.TEXT,
            groupId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
