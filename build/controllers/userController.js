"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jwt_1 = require("../utils/jwt");
const logger_1 = require("../utils/logger");
const models_1 = __importDefault(require("../models"));
const { User } = models_1.default.models;
const register = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let { email, password, firstName, lastName, role } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const parsedRole = role === 1 ? "ADMIN" : "USER";
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            role: parsedRole,
        });
        const token = (0, jwt_1.generateToken)(user);
        user.token = token;
        await user.save();
        logger_1.logger.info(`New ${parsedRole} registered: ${user.id}`);
        res
            .status(201)
            .json({
            message: "New user registered",
            user_id: user.id,
            role: parsedRole,
        });
    }
    catch (error) {
        logger_1.logger.error("Error in user registration:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await user.validatePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        logger_1.logger.info(`User logged in: ${user.id}`);
        res.status(200).json({ message: "Logged in SuccessFully", user: user });
    }
    catch (error) {
        logger_1.logger.error("Error in user login:", error);
        res.status(500).json({ error: "Server error" });
    }
};
exports.login = login;
