'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Diffrents', {
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
      changeId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      changeId2: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      time: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      time2: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      day: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Diffrents');
  }
};