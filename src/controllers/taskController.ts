import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import  { TaskAttributes } from '../models/task';
import { AuthRequest } from '../middlewares/auth';
import { logger } from '../utils/logger';
import { sendNotification } from '../utils/notifications';
import { Op } from 'sequelize';
import db from "../models";
const { User , Task} = db.models;


export const taskController = {
  async createTask(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, dueDate, assigneeId } = req.body;
      const creatorId = req.user!.id;

      const assignee = await User.findByPk(assigneeId);
      if (!assignee) {
        return res.status(404).json({ error: 'Assignee not found' });
      }

      const task = await Task.create({
        title,
        description,
        dueDate,
        creatorId,
        assigneeId,
        status: 'PENDING'
      } as TaskAttributes);

     const mailContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #0066cc;">Task Management</h1>
          <h3 style="color: #333;">New Task Assigned</h3>
        </div>
        <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
        ${assignee.firstName}
        <p style="font-size: 16px; margin-bottom: 20px;">
          New Task Has Been Assigned to You
        </p>
        You have been assigned to task: ${task.title}
      </div>
    `;
      
      if (assignee && assignee.email) {
        const notificationSent = await sendNotification(
        assignee.email,
          'New Task Assigned',
          mailContent
        );
        
        if (!notificationSent) {
          logger.warn(`Failed to send notification for task ${task.id} to ${assignee.email}`);
        }
      }

      logger.info(`New task created: ${task.id} by user: ${creatorId}`);
      res.status(201).json({message: `New task created -taskId::${task.id} by user- userID: ${creatorId}`, task});
    } catch (error) {
      logger.error('Error in task creation:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (req.user!.role !== 'ADMIN' && task.creatorId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const updates = req.body;
      await task.update(updates);


      if (updates.assigneeId) {
        const newAssignee = await User.findByPk(updates.assigneeId);
        if (newAssignee && newAssignee.email) {
            const mailContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
              <div style="text-align: center; padding-bottom: 20px;">
                <h1 style="color: #0066cc;">Task Management</h1>
                <h3 style="color: #333;">Task Updated</h3>
              </div>
              <p style="font-size: 16px; margin-bottom: 20px;">Hello,</p>
              ${newAssignee.firstName}
              <p style="font-size: 16px; margin-bottom: 20px;">
                Your task Has been Updated 
              </p>
             Status of your task is : ${task.status}
            </div>
          `;
          await sendNotification(
            newAssignee.email,
            'Task Reassigned',
            mailContent
          );
        }
      }

      logger.info(`Task updated: ${task.id} by user: ${req.user!.id}`);

      res.status(201).json({message:`Task updated: ${task.id} by user: ${req.user!.id}`, task});
    } catch (error) {
      logger.error('Error in task update:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const task = await Task.findByPk(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      if (req.user!.role !== 'ADMIN' && task.creatorId !== req.user!.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await task.destroy();
      logger.info(`Task deleted: ${id} by user: ${req.user!.id}`);

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      logger.error('Error in task deletion:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  async getTasks(req: AuthRequest, res: Response) {
    try {
      const whereClause = req.user!.role === 'ADMIN' 
        ? {} 
        : {
            [Op.or]: [
              { creatorId: req.user!.id },
              { assigneeId: req.user!.id }
            ]
          };

      const tasks = await Task.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'creator', attributes: ['id', 'email', 'firstName', 'lastName'] },
          { model: User, as: 'assignee', attributes: ['id', 'email', 'firstName', 'lastName'] }
        ]
      });

      res.json(tasks);
    } catch (error) {
      logger.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },


async updateTaskStatus(req: AuthRequest, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user!.id;

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: PENDING, IN_PROGRESS, COMPLETED' 
      });
    }

    const task = await Task.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: User, as: 'assignee', attributes: ['id', 'email', 'firstName', 'lastName'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const isAdmin = req.user!.role === 'ADMIN';
    const isCreator = task.creatorId === req.user!.id;
    
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ 
        error: 'Not authorized. Only task creators or admins can update task status.' 
      });
    }

    const oldStatus = task.status;
    await task.update({ status });

    logger.info(
      `Task ${task.id} status updated from ${oldStatus} to ${status} by user ${req.user!.id}`
    );

    if (task.assignee && task.assignee.email) {
      await sendNotification(
        task.assignee.email,
        'Task Status Updated',
        `Task "${task.title}" status has been updated from ${oldStatus} to ${status}`
      );
    }

    res.json({
      message: `Task status updated successfully by ${req.user!.role}`,
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
        previousStatus: oldStatus,
        updatedAt: task.updatedAt,
        creator: task.creator,
        assignee: task.assignee
      }
    });

  } catch (error) {
    logger.error('Error in task status update:', error);
    res.status(500).json({ error: 'Server error' });
  }
},
};