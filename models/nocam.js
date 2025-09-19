'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nocam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Nocam.belongsTo(models.Super, {
        foreignKey: 'superId'
      })
      Nocam.belongsTo(models.Change, {
        foreignKey: 'changeId'
      })
    }
  }
  Nocam.init({
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
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    middlename: DataTypes.STRING,
    date: DataTypes.STRING,
    rasm: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Nocam',
  });
  return Nocam;
};