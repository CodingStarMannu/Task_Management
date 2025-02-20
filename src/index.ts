import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });
import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import sequelize from "./config/database";
import path from "path";

const app: Application = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.send("Hello, world!");
});

app.use("/", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not Found",
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      console.log("Database connection verified at startup.");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
    }
  });
}

export default app;