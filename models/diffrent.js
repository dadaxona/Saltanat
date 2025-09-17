'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diffrent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Diffrent.init({
    superId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Supers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    changeId: DataTypes.INTEGER,
    changeId2: DataTypes.INTEGER,
    time: DataTypes.STRING,
    time2: DataTypes.STRING,
    day: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Diffrent',
  });
  return Diffrent;
};