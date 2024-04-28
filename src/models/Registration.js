'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Registration extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Registration.init(
        {
            invoiceId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            totalPrice: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: 'Registration',
        }
    );
    return Registration;
};
