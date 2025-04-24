import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    freezeTableName: true,
    timestamps: true,
    underscored: true
  }
});

// Import models
import Student from './student.js';
import Transaction from './Transaction.js';
import User from './User.js';
import InsurancePlan from './insurancePlan.js';

// Initialize models
const models = {
  Student: Student.init(sequelize),
  Transaction: Transaction.init(sequelize),
  User: User.init(sequelize),
  InsurancePlan: InsurancePlan.init(sequelize),
  sequelize,
  Sequelize
};

// Setup associations if defined
Object.values(models).forEach(model => {
  if (model?.associate) model.associate(models);
});

export default models;
