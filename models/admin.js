'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.belongsTo(models.Super, {
        foreignKey: 'superId'
      });
    }
  }
  Admin.init({
    superId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Supers',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    statistika: DataTypes.STRING,
    staff: DataTypes.STRING,
    device: DataTypes.STRING,
    change: DataTypes.STRING,
    bag: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};