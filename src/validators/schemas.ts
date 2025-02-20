import { body } from 'express-validator';

export const userValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
};

export const taskValidation = {
  create: [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('dueDate').isISO8601().toDate(),
    body('assigneeId').isNumeric(),
  ],
  update: [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('dueDate').optional().isISO8601().toDate(),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
    body('assigneeId').optional().isNumeric(),
  ],
  updateStatus:[
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  ]
};