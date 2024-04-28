'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Employee.belongsTo(models.User);
        }
    }
    Employee.init(
        {
            userId: DataTypes.INTEGER,
            address: DataTypes.STRING,
            salary: DataTypes.FLOAT,
            joinDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Employee',
        }
    );
    return Employee;
};
