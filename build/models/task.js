'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const sequelize_1 = require("sequelize");
class Task extends sequelize_1.Model {
    static initModel(sequelize) {
        Task.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED'),
                defaultValue: 'PENDING',
            },
            dueDate: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            creatorId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            assigneeId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Task',
        });
        return Task;
    }
    static associate(models) {
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
exports.Task = Task;
exports.default = Task;
