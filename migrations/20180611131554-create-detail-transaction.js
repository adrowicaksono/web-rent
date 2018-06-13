'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DetailTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TransactionId: {
        type: Sequelize.INTEGER
      },
      InventoryId: {
        type: Sequelize.INTEGER
      },
      tanggal_pinjam: {
        type: Sequelize.DATE
      },
      tanggal_kembali: {
        type: Sequelize.DATE
      },
      harga_sewa: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DetailTransactions');
  }
};