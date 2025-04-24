import { DataTypes, Model } from 'sequelize';

export default class Student extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      insuranceStatus: {
        type: DataTypes.ENUM('pending', 'active', 'expired'),
        defaultValue: 'pending'
      },
      lastPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      insuranceExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Student',
      tableName: 'students',
      timestamps: true
    });
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: 'studentId',
      as: 'transactions'
    });
  }
}
