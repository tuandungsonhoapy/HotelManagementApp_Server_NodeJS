'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('doctor_infos', {
        // doctorId: DataTypes.INTEGER,
        // priceId: DataTypes.INTEGER,
        // provinceId: DataTypes.INTEGER,
        // paymentId: DataTypes.INTEGER,
        // addressClinic: DataTypes.STRING,
        // nameClinic: DataTypes.STRING,
        // note: DataTypes.STRING,
        // count: DataTypes.INTEGER
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      priceId: {
        type: Sequelize.INTEGER
      },
      provinceId: {
        type: Sequelize.INTEGER
      },
      paymentId: {
        type: Sequelize.INTEGER
      },
      addressClinic: {
        type: Sequelize.STRING
      },
      nameClinic: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      count: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('doctor_infos');
  }
};