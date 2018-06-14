'use strict';
module.exports = (sequelize, DataTypes) => {
  var Inventory = sequelize.define('Inventory', {
    jenis: DataTypes.STRING,
    serial_number: DataTypes.STRING,
    kategori: DataTypes.STRING,
    status: DataTypes.STRING,
    // tanggal_pinjam: DataTypes.DATE,
    // tanggal_kembali: DataTypes.DATE,
    harga_sewa: DataTypes.INTEGER
  }, {});
  Inventory.associate = function(models) {
    // associations can be defined here
    // Inventory.hasMany(models.Transaction)
    Inventory.hasMany(models.DetailTransaction)
    Inventory.belongsToMany(models.Transaction, {through:'DetailTransaction'})
  };

  
  return Inventory;
};