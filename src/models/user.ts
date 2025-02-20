// models/user.ts
import { DataTypes, Model, Sequelize } from "sequelize";
import bcrypt from 'bcrypt';

export interface UserAttributes {
  id?: number | null;
  email: string;
  password: string;
  token?: string | null;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public token?: string;
  public firstName!: string;
  public lastName!: string;
  public role!: 'ADMIN' | 'USER';
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    return this.password ? bcrypt.compare(password, this.password) : false;
  }

  static initModel(sequelize: Sequelize): typeof User {
    return User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('ADMIN', 'USER'),
          defaultValue: 'USER',
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "Users",
        hooks: {
          beforeCreate: async (user: User) => {
            if (user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
          beforeUpdate: async (user: User) => {
            if (user.changed('password') && user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
        },
      }
    );
  }

  static associate(models: any) {
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

export default User;