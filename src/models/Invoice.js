'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Invoice.belongsToMany(models.Service, { through: 'Receipt' });
            Invoice.belongsTo(models.User);
            Invoice.belongsToMany(models.Room, { through: 'Booking' });
        }
    }
    Invoice.init(
        {
            status: DataTypes.INTEGER,
            totalAmount: DataTypes.FLOAT,
            note: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            payments: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: 'Invoice',
        }
    );
    return Invoice;
};
