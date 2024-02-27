'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('markdowns', {
        // doctorId: DataTypes.INTEGER,
        // clinicId: DataTypes.INTEGER,
        // specialtyId: DataTypes.INTEGER,
        // contentHTML: DataTypes.TEXT,
        // contentMarkdown: DataTypes.STRING,
        // description: DataTypes.TEXT
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      clinicId: {
        type: Sequelize.INTEGER
      },
      specialtyId: {
        type: Sequelize.INTEGER
      },
      contentHTML: {
        type: Sequelize.TEXT
      },
      contentMarkdown: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('markdowns');
  }
};