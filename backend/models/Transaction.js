import { DataTypes, Model } from 'sequelize';

export default class Transaction extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: DataTypes.ENUM('pending', 'Success', 'Failed'),
        defaultValue: 'pending',
        allowNull: false
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
      },
      payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      callback_data: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      receipt_number: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      merchant_request_id: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      account_reference: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'INSURANCE'
      },
      checkoutRequestID: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true,
      underscored: false,
      indexes: [
        {
          name: 'idx_transactions_merchant_request',
          fields: ['merchant_request_id']
        },
        {
          name: 'idx_transactions_phone_status',
          fields: ['phone', 'status']
        }
      ]
    });
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}