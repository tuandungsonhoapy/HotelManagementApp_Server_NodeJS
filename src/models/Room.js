'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Room.belongsTo(models.Category);
            Room.belongsToMany(models.Invoice, { through: 'Booking' });
            Room.hasMany(models.Image);
        }
    }
    Room.init(
        {
            roomNumber: DataTypes.STRING,
            status: DataTypes.INTEGER,
            price: DataTypes.FLOAT,
            categoryId: DataTypes.INTEGER,
            image: DataTypes.TEXT,
            description: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Room',
        }
    );
    return Room;
};
