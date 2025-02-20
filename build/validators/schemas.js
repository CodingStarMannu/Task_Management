"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userValidation = {
    register: [
        (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
        (0, express_validator_1.body)('password').isLength({ min: 6 }),
        (0, express_validator_1.body)('firstName').trim().notEmpty(),
        (0, express_validator_1.body)('lastName').trim().notEmpty(),
    ],
    login: [
        (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
        (0, express_validator_1.body)('password').notEmpty(),
    ],
};
exports.taskValidation = {
    create: [
        (0, express_validator_1.body)('title').trim().notEmpty(),
        (0, express_validator_1.body)('description').trim().notEmpty(),
        (0, express_validator_1.body)('dueDate').isISO8601().toDate(),
        (0, express_validator_1.body)('assigneeId').isNumeric(),
    ],
    update: [
        (0, express_validator_1.body)('title').optional().trim().notEmpty(),
        (0, express_validator_1.body)('description').optional().trim().notEmpty(),
        (0, express_validator_1.body)('dueDate').optional().isISO8601().toDate(),
        (0, express_validator_1.body)('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
        (0, express_validator_1.body)('assigneeId').optional().isNumeric(),
    ],
    updateStatus: [
        (0, express_validator_1.body)('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    ]
};
