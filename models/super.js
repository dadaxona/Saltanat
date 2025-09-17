'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Super extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Super.hasMany(models.Admin, {
        foreignKey: 'superId'
      })
      Super.hasMany(models.Device, {
        foreignKey: 'superId'
      });
      Super.hasMany(models.Change, {
        foreignKey: 'superId'
      });
      Super.hasMany(models.Staff, {
        foreignKey: 'superId'
      });
      Super.hasMany(models.Analiz, {
        foreignKey: 'superId'
      });
      Super.hasMany(models.Control, {
        foreignKey: 'superId'
      });
    }
  }
  Super.init({
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Super',
  });
  return Super;
};