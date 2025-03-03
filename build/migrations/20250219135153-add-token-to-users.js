"use strict";
var { DataTypes } = require("sequelize");
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Users", "token", {
            type: DataTypes.STRING,
            allowNull: true,
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Users", "token");
    },
};
