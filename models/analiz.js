'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Analiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Analiz.belongsTo(models.Super, {
        foreignKey: 'superId'
      });
      Analiz.belongsTo(models.Staff, {
        foreignKey: 'staffId'
      });
      Analiz.belongsTo(models.Change, {
        foreignKey: 'changeId'
      });
    }
  }
  Analiz.init({
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
    changeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    middlename: DataTypes.STRING,
    time: DataTypes.STRING,
    time2: DataTypes.STRING,
    day: DataTypes.STRING,
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    status: DataTypes.STRING,
    status2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Analiz',
  });
  return Analiz;
};