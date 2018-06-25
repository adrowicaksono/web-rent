'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
      return [queryInterface.addColumn('Members', 'email', {type:Sequelize.STRING}),
              queryInterface.addColumn('Members', 'password', {type:Sequelize.STRING}),
              queryInterface.addColumn('Members', 'salt', {type:Sequelize.STRING}),
              queryInterface.addColumn('Members', 'role', {type:Sequelize.STRING})]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
