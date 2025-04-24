import { DataTypes, Model } from 'sequelize';

export default class User extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'staff', 'student'),
        defaultValue: 'student'
      }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    });
  }

  static associate(models) {
    // You can define relations here if needed later
    // For example: this.hasMany(models.Transaction, ...)
  }
}
