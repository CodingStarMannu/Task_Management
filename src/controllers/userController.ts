import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwt";
import { logger } from "../utils/logger";
import { UserAttributes } from "../models/user";
import db from "../models";
const { User } = db.models;

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
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
    } as UserAttributes);

    const token = generateToken(user);
    user.token = token;
    await user.save();

    logger.info(`New ${parsedRole} registered: ${user.id}`);

    res
      .status(201)
      .json({
        message: "New user registered",
        user_id: user.id,
        role: parsedRole,
      });
  } catch (error) {
    logger.error("Error in user registration:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    logger.info(`User logged in: ${user.id}`);

    res.status(200).json({ message: "Logged in SuccessFully", user: user });
  } catch (error) {
    logger.error("Error in user login:", error);
    res.status(500).json({ error: "Server error" });
  }
};

