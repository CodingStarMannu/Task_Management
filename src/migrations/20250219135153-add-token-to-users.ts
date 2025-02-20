"use strict";
var { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.addColumn("Users", "token", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface: any, Sequelize: any) => {
    await queryInterface.removeColumn("Users", "token");
  },
};
