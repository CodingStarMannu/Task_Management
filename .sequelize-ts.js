require("ts-node/register");
const { resolve } = require("path");

// Set paths for Sequelize CLI
process.env.SEQUELIZE_CONFIG = resolve("src/config/config.ts");

require("sequelize-cli/lib/sequelize");

const config = require("./build/config/config.js");
console.log(config);