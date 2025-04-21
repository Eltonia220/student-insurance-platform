// backend/services/db.js
import pg from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const { Pool } = pg;

// Validate required environment variables
const requiredEnvVars = ['PG_USER', 'PG_HOST', 'PG_DATABASE', 'PG_PASSWORD', 'PG_PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required database config: ${envVar}`);
  }
}

// Configure connection pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return error after 5 seconds if no connection
});

// Event listeners for pool monitoring
pool.on('connect', (client) => {
  logger.debug('➡️ New database connection established');
});

pool.on('error', (err, client) => {
  logger.error('❌ Database connection error:', err);
  process.exit(-1); // Exit process on critical DB errors
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await pool.end();
  logger.info('Database connection pool closed');
  process.exit(0);
});

// Export both pool and query method
export const db = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    // Set timeout for client release
    const timeout = setTimeout(() => {
      logger.error('⚠️ Database client has been checked out for too long');
    }, 5000);
    
    // Monkey patch client release
    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    
    return client;
  },
  pool, // Direct pool access if needed
};