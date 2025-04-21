// models/index.js (for Sequelize)
import { Sequelize } from 'sequelize';
import studentModel from './student.js';
import insuranceModel from './insurancePlan.js';
import transactionModel from './Transaction.js';
import userModel from './user.js';

const sequelize = new Sequelize(process.env.DATABASE_URL);

const models = {
  Student: studentModel(sequelize),
  InsurancePlan: insuranceModel(sequelize),
  Transaction: transactionModel(sequelize),
  User: userModel(sequelize),
  sequelize, // Add sequelize instance
};

// Establish relationships
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;