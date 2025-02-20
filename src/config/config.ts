import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });

import { Dialect } from "sequelize";

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port?: number;
  dialect: Dialect;
  seederStorage?: string;
  migrationStorageTableName?: string;
  migrationStorageFileExtension?: string;
}

const config: { [key: string]: DBConfig } = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '09870',
    database: process.env.DB_NAME || 'taskmanage',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT!, 10),
    dialect: "postgres",
    seederStorage: "sequelize",
    migrationStorageTableName: "SequelizeMeta",
    migrationStorageFileExtension: "ts",
  },
  test: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME_TEST!,
    host: process.env.DB_HOST!,
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    dialect: "postgres",
    seederStorage: "sequelize",
    migrationStorageTableName: "SequelizeMeta",
    migrationStorageFileExtension: "ts",

  },
};

module.exports = config;


