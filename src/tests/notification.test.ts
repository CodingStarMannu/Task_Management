import { sendNotification } from '../utils/notifications';
import { logger } from '../utils/logger';
import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
}));

describe('Notification System', () => {
  it('should send email notifications', async () => {
    const spy = jest.spyOn(logger, 'info');
    
    await sendNotification(
      'test@example.com',
      'Test Subject',
      'Test Message'
    );

    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('Notification sent successfully to test@example.com')
    );
  });
});
