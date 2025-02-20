"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${process.cwd()}/.env` });
const config = {
    development: {
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '09870',
        database: process.env.DB_NAME || 'taskmanage',
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT, 10),
        dialect: "postgres",
        seederStorage: "sequelize",
        migrationStorageTableName: "SequelizeMeta",
        migrationStorageFileExtension: "ts",
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_TEST,
        host: process.env.DB_HOST,
        dialect: "postgres",
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        dialect: "postgres",
        seederStorage: "sequelize",
        migrationStorageTableName: "SequelizeMeta",
        migrationStorageFileExtension: "ts",
    },
};
module.exports = config;
