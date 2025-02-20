import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });
import jwt from 'jsonwebtoken';
import User from '../models/user';


export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  });
};