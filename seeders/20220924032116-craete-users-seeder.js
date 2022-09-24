'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin",
          profession: "Admin Micro BWA",
          role: "admin",
          email: "admin@mirobwa.com",
          password: await bcrypt.hash("secret123", 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Fitra",
          profession: "Mahasiswa",
          role: "student",
          email: "fitra@gmail.com",
          password: await bcrypt.hash("secret123", 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
