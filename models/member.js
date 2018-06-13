'use strict';
module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define('Member', {
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    no_telpon: DataTypes.INTEGER,
    data_scan_id: DataTypes.INTEGER
  }, {});
  Member.associate = function(models) {
    // associations can be defined here
    Member.hasMany(models.Transaction)
  };
  return Member;
};