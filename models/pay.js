'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pay.belongsTo(models.Staff, {
        foreignKey: 'staffId'
      });
    }
  }
  Pay.init({
    superId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Supers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    staffId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Staffs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    all: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pay',
  });
  return Pay;
};