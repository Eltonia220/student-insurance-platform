import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  merchant_request_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  checkoutRequestID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  account_reference: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'Success', 'Failed'),
    defaultValue: 'pending',
  },
  receipt_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  callback_data: {
    type: DataTypes.JSONB,
    allowNull: true,
  }
}, {
  tableName: 'transactions',
  timestamps: true,
});

export default Transaction;
