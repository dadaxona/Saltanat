'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Control extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Control.belongsTo(models.Super, {
        foreignKey: 'superId'
      });
      Control.belongsTo(models.Staff, {
        foreignKey: 'staffId'
      });
    }
  }
  Control.init({
    superId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Supers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    staffId: DataTypes.INTEGER,
    count: DataTypes.INTEGER,
    count2: DataTypes.INTEGER,
    prossent: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Control',
  });
  return Control;
};