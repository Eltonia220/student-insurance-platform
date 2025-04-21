import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');
    await sequelize.sync({ alter: true }); // Sync all models
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
})();

export default sequelize;