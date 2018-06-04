'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Inventories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      jenis: {
        type: Sequelize.STRING
      },
      serial_number: {
        type: Sequelize.STRING
      },
      kategori: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Inventories');
  }
};