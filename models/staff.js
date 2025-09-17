'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staff.belongsTo(models.Super, {
        foreignKey: 'superId'
      });
      Staff.belongsTo(models.Change, {
        foreignKey: 'changeId'
      });
      Staff.hasOne(models.Pay, {
        foreignKey: 'staffId'
      });
      Staff.hasOne(models.Control, {
        foreignKey: 'staffId'
      });
    }
  }
  Staff.init({
    superId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Supers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    changeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Changes',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    middlename: DataTypes.STRING,
    money: DataTypes.STRING,
    date: DataTypes.STRING,
    rasm: DataTypes.TEXT,
    status: DataTypes.STRING,
    qor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};