"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const database_1 = __importDefault(require("../config/database"));
const models_1 = __importDefault(require("../models"));
const { User } = models_1.default.models;
describe('Authentication Tests', () => {
    beforeAll(async () => {
        await database_1.default.sync({ force: true });
    });
    afterAll(async () => {
        await database_1.default.close();
    });
    describe('POST /api/users/register', () => {
        it('should register a new user', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                role: 0 // 0 for USER, 1 for ADMIN
            };
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/users/register')
                .send(userData);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'New user registered');
            expect(res.body).toHaveProperty('user_id');
            expect(res.body).toHaveProperty('role', 'USER');
        });
        it('should not register a user with existing email', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                role: 0
            };
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/users/register')
                .send(userData);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Email already registered');
        });
    });
    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            // Clear users before each test
            await User.destroy({ where: {} });
            // Create a test user
            await User.create({
                email: 'existing@example.com',
                password: 'password123',
                firstName: 'Existing',
                lastName: 'User',
                role: 'USER'
            });
        });
        it('should login an existing user', async () => {
            const loginData = {
                email: 'existing@example.com',
                password: 'password123'
            };
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/users/login')
                .send(loginData);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Logged in SuccessFully');
            expect(res.body).toHaveProperty('user');
        });
        it('should not login with invalid credentials', async () => {
            const loginData = {
                email: 'existing@example.com',
                password: 'wrongpassword'
            };
            const res = await (0, supertest_1.default)(index_1.default)
                .post('/api/users/login')
                .send(loginData);
            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('error', 'Invalid credentials');
        });
    });
});
