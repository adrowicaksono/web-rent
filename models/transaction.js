'use strict';
module.exports = (sequelize, DataTypes) => {
  var Transaction = sequelize.define('Transaction', {
    MemberId: DataTypes.INTEGER,
    total_harga_transaction: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.Member)
    Transaction.hasMany(models.DetailTransaction, {onDelete : 'cascade'})
    Transaction.belongsToMany(models.Inventory, {through:'DetailTransaction'})
  };
  return Transaction;
};