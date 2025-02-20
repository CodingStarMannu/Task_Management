'use strict';
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface TaskAttributes {
  id?: number | null
  title?: string | null;
  description?: string | null;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: Date | null;
  creatorId?: number | null
  assigneeId?: number | null
  createdAt?: Date;
  updatedAt?: Date;
}

export class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number | null
  public title!: string | null;
  public description!: string | null;
  public status!: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  public dueDate!: Date | null;
  public creatorId!: number | null
  public assigneeId!:number | null
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof Task {
    Task.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
          defaultValue: 'PENDING',
        },
        dueDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        creatorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        assigneeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Task',
      }
    );
    return Task;
  }

  public static associate(models: any) {
    Task.belongsTo(models.User, {
      foreignKey: 'creatorId',
      as: 'creator',
    });
    Task.belongsTo(models.User, {
      foreignKey: 'assigneeId',
      as: 'assignee',
    });
  }
}

export default Task;