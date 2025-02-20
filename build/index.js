"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${process.cwd()}/.env` });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("./config/database"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/api", (req, res) => {
    res.send("Hello, world!");
});
app.use("/", routes_1.default);
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
            await database_1.default.authenticate();
            console.log("Database connection verified at startup.");
        }
        catch (error) {
            console.error("Failed to connect to the database:", error);
        }
    });
}
exports.default = app;
