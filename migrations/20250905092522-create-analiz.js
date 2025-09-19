'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Analizs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      superId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Supers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      staffId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      changeId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      smen: {
        allowNull: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      lastname: {
        allowNull: true,
        type: Sequelize.STRING
      },
      middlename: {
        allowNull: true,
        type: Sequelize.STRING
      },
      time: {
        allowNull: true,
        type: Sequelize.STRING
      },
      time2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      errortime: {
        allowNull: true,
        type: Sequelize.STRING
      },
      errortime2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      owerall: {
        allowNull: true,
        type: Sequelize.STRING
      },
      summa: {
        allowNull: true,
        type: Sequelize.STRING
      },
      day: {
        allowNull: true,
        type: Sequelize.STRING
      },
      month: {
        allowNull: true,
        type: Sequelize.STRING
      },
      year: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      online: {
        allowNull: true,
        type: Sequelize.BOOLEAN
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Analizs');
  }
};