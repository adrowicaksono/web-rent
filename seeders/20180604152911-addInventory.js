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
      return queryInterface.bulkInsert('Inventories', [{
        jenis : 'Canon C300',
        serial_number : 'ash1202013',
        kategori : 'kamera',
        harga_sewa : 1500000,
      },{
        jenis : 'SONY PXW-FS7',
        serial_number : 'ash1as9886',
        kategori : 'kamera',
        harga_sewa : 1750000,
      },{
        jenis : 'Blonde 2000W',
        serial_number : 'aasd1as9886',
        kategori : 'lighting',
        harga_sewa : 2500000,
      }], {})
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
      return queryInterface.bulkDelete('Inventoires', null, {})
  }
};
