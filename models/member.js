'use strict';


module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define('Member', {
    name: DataTypes.STRING,
    alamat: DataTypes.STRING,
    no_telpon: DataTypes.INTEGER,
    data_scan_id: DataTypes.INTEGER,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
         isUnique: function(email,next) {
          Member.findOne({where:{email:email}})
          .then((member)=>{
            if(member){
              next('email is used')
            }
            else{
              next()
            }
          })
        }
      }
    },
    password : DataTypes.STRING,
    salt : DataTypes.STRING,
    role : DataTypes.STRING,
  }, {
    hooks: {
      beforeCreate: function(member,option){
        const bcrypt = require('bcrypt')
        const saltGenerate = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(member.password,saltGenerate)
        member.salt = saltGenerate
        member.password = hash
      }
    }
  });
  Member.associate = function(models) {
    // associations can be defined here
    Member.hasMany(models.Transaction)
  };
  return Member;
};