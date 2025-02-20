"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const taskRoutes_1 = __importDefault(require("./taskRoutes"));
const router = (0, express_1.Router)();
router.use('/api/users', userRoutes_1.default);
router.use('/api/tasks', taskRoutes_1.default);
exports.default = router;
