import dotenv from "dotenv";
import { Sequelize } from "sequelize";
const config = require('./config');

dotenv.config({ path: `${process.cwd()}/.env` });

const env = (process.env.NODE_ENV || "development") as keyof typeof config;

const dbConfig = config[env];

// Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
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
  }
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connection established successfully in ${String(env)} environment.`);
    // Uncomment for automatic model synchronization (use with caution in production)
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

connectToDatabase();

export default sequelize;
