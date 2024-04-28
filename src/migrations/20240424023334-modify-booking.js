'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addColumn('Booking', 'invoiceId', {
            type: Sequelize.INTEGER,
            references: {
                model: 'Invoice', // name of Target model
                key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        await queryInterface.addColumn('Booking', 'price', {
            type: Sequelize.FLOAT,
        });

        await queryInterface.removeColumn('Booking', 'registrationId');
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.addColumn('Booking', 'registrationId', {
            type: Sequelize.INTEGER,
        });

        await queryInterface.removeColumn('Booking', 'price');
        await queryInterface.removeColumn('Booking', 'invoiceId');
    },
};
