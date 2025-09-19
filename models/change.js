'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Change extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Change.belongsTo(models.Super, {
        foreignKey: 'superId'
      });
    }
  }
  Change.init({
    superId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Supers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    smen: DataTypes.STRING,
    time: DataTypes.STRING,
    day: DataTypes.BOOLEAN,
    time2: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Change',
  });
  return Change;
};