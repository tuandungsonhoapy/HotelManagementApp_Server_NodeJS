'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Receipt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Receipt.hasOne(models.Service);
        }
    }
    Receipt.init(
        {
            invoiceId: DataTypes.INTEGER,
            serviceId: DataTypes.INTEGER,
            amount: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: 'Receipt',
        }
    );
    return Receipt;
};
