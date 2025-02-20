"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/user.ts
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
class User extends sequelize_1.Model {
    async validatePassword(password) {
        return this.password ? bcrypt_1.default.compare(password, this.password) : false;
    }
    static initModel(sequelize) {
        return User.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: sequelize_1.DataTypes.ENUM('ADMIN', 'USER'),
                defaultValue: 'USER',
            },
        }, {
            sequelize,
            modelName: "User",
            tableName: "Users",
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt_1.default.genSalt(10);
                        user.password = await bcrypt_1.default.hash(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed('password') && user.password) {
                        const salt = await bcrypt_1.default.genSalt(10);
                        user.password = await bcrypt_1.default.hash(user.password, salt);
                    }
                },
            },
        });
    }
    static associate(models) {
        User.hasMany(models.Task, {
            foreignKey: 'creatorId',
            as: 'createdTasks',
        });
        User.hasMany(models.Task, {
            foreignKey: 'assigneeId',
            as: 'assignedTasks',
        });
    }
}
exports.default = User;
