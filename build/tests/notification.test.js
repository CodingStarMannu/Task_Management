"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notifications_1 = require("../utils/notifications");
const logger_1 = require("../utils/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: `${process.cwd()}/.env` });
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
    }),
}));
describe('Notification System', () => {
    it('should send email notifications', async () => {
        const spy = jest.spyOn(logger_1.logger, 'info');
        await (0, notifications_1.sendNotification)('test@example.com', 'Test Subject', 'Test Message');
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Notification sent successfully to test@example.com'));
    });
});
