"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const models_1 = __importDefault(require("../models"));
const database_1 = __importDefault(require("../config/database"));
const jwt_1 = require("../utils/jwt");
const { User, Task } = models_1.default.models;
describe("Task Management Tests", () => {
    let userToken;
    let adminToken;
    let user;
    let admin;
    let assignee;
    beforeAll(async () => {
        jest.setTimeout(10000);
        await database_1.default.sync({ force: true });
        // Create test users with proper typing
        user = await User.create({
            email: "user@example.com",
            password: "password123",
            firstName: "Test",
            lastName: "User",
            role: "USER",
        });
        admin = await User.create({
            email: "admin@example.com",
            password: "password123",
            firstName: "Admin",
            lastName: "User",
            role: "ADMIN",
        });
        assignee = await User.create({
            email: "assignee@example.com",
            password: "password123",
            firstName: "Assignee",
            lastName: "User",
            role: "USER",
        });
        // Generate tokens using the actual User instances
        userToken = `Bearer ${(0, jwt_1.generateToken)(user)}`;
        adminToken = `Bearer ${(0, jwt_1.generateToken)(admin)}`;
    });
    beforeEach(async () => {
        await Task.destroy({ where: {} });
    });
    afterAll(async () => {
        await database_1.default.close();
    });
    describe("POST /api/tasks/createTask", () => {
        it("should create a new task successfully", async () => {
            const taskData = {
                title: "Test Task",
                description: "Test Description",
                dueDate: new Date().toISOString(),
                assigneeId: assignee.id,
            };
            const res = await (0, supertest_1.default)(index_1.default)
                .post("/api/tasks/createTask")
                .set("Authorization", userToken)
                .send(taskData);
            expect(res.status).toBe(201);
            expect(res.body.task).toHaveProperty("title", taskData.title);
            expect(res.body.task).toHaveProperty("description", taskData.description);
            expect(res.body.task).toHaveProperty("status", "PENDING");
        });
        it("should return 400 for missing required fields", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post("/api/tasks/createTask")
                .set("Authorization", userToken)
                .send({
                title: "Test Task",
                // Missing required fields
            });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("errors");
            expect(Array.isArray(res.body.errors)).toBe(true);
        });
        it("should return 404 for non-existent assignee", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .post("/api/tasks/createTask")
                .set("Authorization", userToken)
                .send({
                title: "Test Task",
                description: "Test Description",
                dueDate: new Date().toISOString(),
                assigneeId: 99999,
            });
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("error", "Assignee not found");
        });
    });
    describe("PATCH /api/tasks/updateTaskStatus/:id", () => {
        let task;
        beforeEach(async () => {
            task = await Task.create({
                title: "Status Test Task",
                description: "Description",
                dueDate: new Date(),
                creatorId: user.id,
                assigneeId: assignee.id,
                status: "PENDING",
            });
        });
        it("should update task status successfully", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .patch(`/api/tasks/updateTaskStatus/${task.id}`)
                .set("Authorization", userToken)
                .send({ status: "IN_PROGRESS" });
            expect(res.status).toBe(200);
            expect(res.body.task.status).toBe("IN_PROGRESS");
            expect(res.body.task.previousStatus).toBe("PENDING");
        });
        it("should return 400 for invalid status", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .patch(`/api/tasks/updateTaskStatus/${task.id}`)
                .set("Authorization", userToken)
                .send({ status: "INVALID_STATUS" });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("error");
            expect(res.body.error).toMatch(/invalid status/i);
        });
        it("should allow admin to update any task status", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .patch(`/api/tasks/updateTaskStatus/${task.id}`)
                .set("Authorization", adminToken)
                .send({ status: "COMPLETED" });
            expect(res.status).toBe(200);
            expect(res.body.task.status).toBe("COMPLETED");
        });
    });
    describe("GET /api/tasks", () => {
        beforeEach(async () => {
            await Task.destroy({ where: {} });
            await Promise.all([
                Task.create({
                    title: "User Created Task",
                    description: "Description",
                    dueDate: new Date(),
                    creatorId: user.id,
                    assigneeId: assignee.id,
                    status: "PENDING",
                }),
                Task.create({
                    title: "Assigned to User",
                    description: "Description",
                    dueDate: new Date(),
                    creatorId: admin.id,
                    assigneeId: user.id,
                    status: "IN_PROGRESS",
                }),
                Task.create({
                    title: "Admin Task",
                    description: "Description",
                    dueDate: new Date(),
                    creatorId: admin.id,
                    assigneeId: admin.id,
                    status: "COMPLETED",
                })
            ]);
        });
        it("should get all tasks for admin", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .get("/api/tasks")
                .set("Authorization", adminToken);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(3);
        });
        it("should get only relevant tasks for user", async () => {
            const res = await (0, supertest_1.default)(index_1.default)
                .get("/api/tasks")
                .set("Authorization", userToken);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });
    });
});
