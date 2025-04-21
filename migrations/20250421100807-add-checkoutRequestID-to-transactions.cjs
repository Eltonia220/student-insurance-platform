'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transactions', 'checkoutRequestID', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on your needs
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('transactions', 'checkoutRequestID');
  }
};
