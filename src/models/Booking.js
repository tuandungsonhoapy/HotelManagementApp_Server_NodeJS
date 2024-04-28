'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Booking.belongsTo(models.Group);
        }
    }
    Booking.init(
        {
            checkIn: DataTypes.DATE,
            checkOut: DataTypes.DATE,
            roomId: DataTypes.INTEGER,
            invoiceId: DataTypes.INTEGER,
            price: DataTypes.FLOAT,
        },
        {
            sequelize,
            modelName: 'Booking',
        }
    );
    return Booking;
};
