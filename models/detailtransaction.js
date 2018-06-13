'use strict';
module.exports = (sequelize, DataTypes) => {
  var DetailTransaction = sequelize.define('DetailTransaction', {
    TransactionId: DataTypes.INTEGER,
    InventoryId: DataTypes.INTEGER,
    tanggal_pinjam: DataTypes.DATE,
    tanggal_kembali: DataTypes.DATE,
    harga_sewa: DataTypes.INTEGER
  }, {});
  DetailTransaction.associate = function(models) {
    // associations can be defined here
    DetailTransaction.belongsTo(models.Inventory)
    DetailTransaction.belongsTo(models.Transaction)
  };
  return DetailTransaction;
};