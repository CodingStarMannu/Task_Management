"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const config = require('./config');
dotenv_1.default.config({ path: `${process.cwd()}/.env` });
const env = (process.env.NODE_ENV || "development");
const dbConfig = config[env];
// Sequelize instance
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: env !== "production" ? console.log : false,
    // Connection pool configuration
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // Postgres-specific configurations
    ...(dbConfig.dialect === "postgres"
        ? {
            dialectOptions: {
                ssl: env === "production" ? { rejectUnauthorized: false } : false,
            },
        }
        : {}),
});
const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database connection established successfully in ${String(env)} environment.`);
        // Uncomment for automatic model synchronization (use with caution in production)
        // await sequelize.sync({ alter: true });
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};
connectToDatabase();
exports.default = sequelize;
