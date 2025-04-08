// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    retry: {
      max: 5,
      timeout: 5000,
      match: [
        /ConnectionError/,
        /ConnectionTimedOutError/,
        /TimeoutError/,
        Sequelize.ConnectionError,
        Sequelize.ConnectionTimedOutError,
        Sequelize.TimeoutError
      ]
    },
    pool: {
      max: 10,
      min: 2,
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

// Enhanced connection test with retries
export async function verifyDatabaseConnection() {
  let attempts = 0;
  const maxAttempts = 5;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  while (attempts < maxAttempts) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
      return true;
    } catch (error) {
      attempts++;
      console.error(`❌ Connection attempt ${attempts}/${maxAttempts} failed:`);
      
      if (error.original && error.original.code === '3D000') {
        console.error('Database does not exist. Please create it first.');
        process.exit(1);
      }

      if (attempts < maxAttempts) {
        console.log(`Retrying in 5 seconds...`);
        await delay(5000);
      } else {
        console.error('Unable to connect to the database after multiple attempts:');
        console.error(error);
        process.exit(1);
      }
    }
  }
}

export default sequelize;