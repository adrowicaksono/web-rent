'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('Members', [{
        name : 'admin',
        alamat : 'Jl. Tebet Timur Dalam 2',
        no_telpon : '0821111111',
        email : 'admin@admin.com',
        password : '$2b$08$nH6yYErcdoYSoaOhKC/j6uRrv78Js9JbfzTzJN6IiwmWRI/zyER/C',
        salt : '$2b$08$nH6yYErcdoYSoaOhKC/j6u',
        role : 'admin',
      },{
        name : 'Didit',
        alamat : 'Jl. Tebet Timur Dalam 2',
        no_telpon : '0823456789',
      },{
        name : 'Dodot',
        alamat : 'Jl. Tebet Timur Dalam 3',
        no_telpon : '08234534567',
      },{
        name : 'Dedet',
        alamat : 'Jl. Tebet Timur Dalam 4',
        no_telpon : '082349876589',
      }], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('Members', null, {})
  }
};
