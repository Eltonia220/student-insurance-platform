// models/index.js
import { Sequelize } from 'sequelize';
import User from './User.js';  // Note the .js extension

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

// Initialize models
const models = {
  User: User(sequelize),
  // Add other models here as: ModelName: ModelName(sequelize)
};

// Create associations if needed
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Export connection and models
export { sequelize };
export default models;