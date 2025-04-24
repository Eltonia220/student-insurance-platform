'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'studentId', {
      type: Sequelize.INTEGER,
      allowNull: true
      // No foreign key reference
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'studentId');
  }
};
