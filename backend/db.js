const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const config = {
  user: process.env.DB_USER || 'student_insurer',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'student_aggregator_',
  password: process.env.DB_PASSWORD || 'Ell224y2026',
  port: process.env.DB_PORT || 5432,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to try connecting before timing out
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
      // For production, you should provide CA certificate
      // ca: fs.readFileSync('/path/to/server-ca.pem').toString(),
    }
  })
};

// Create a connection pool
const pool = new Pool(config);

/**
 * Test the database connection
 * @returns {Promise<boolean>} true if connection is successful
 */
async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  } finally {
    if (client) client.release();
  }
}

/**
 * Execute a SQL query with parameters
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function query(text, params) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error:', { text, params });
    throw err;
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} PostgreSQL client
 */
async function getClient() {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;

  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);

  // Monkey patch the query method to track the last query
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    // Clear the timeout
    clearTimeout(timeout);
    // Reset the original query method
    client.query = query;
    // Release the client
    release.apply(client);
  };

  return client;
}

// Student-specific operations
const Student = {
  /**
   * Get all students
   * @returns {Promise<Array>} Array of student records
   */
  async getAll() {
    const { rows } = await query('SELECT * FROM students ORDER BY student_id');
    return rows;
  },

  /**
   * Get student by ID
   * @param {string} studentId 
   * @returns {Promise<Object|null>} Student record or null if not found
   */
  async getById(studentId) {
    const { rows } = await query('SELECT * FROM students WHERE student_id = $1', [studentId]);
    return rows[0] || null;
  },

  /**
   * Create a new student
   * @param {Object} studentData 
   * @returns {Promise<Object>} Created student record
   */
  async create({ student_id, first_name, last_name, email, phone = null, is_international = false }) {
    const { rows } = await query(
      'INSERT INTO students(student_id, first_name, last_name, email, phone, is_international) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [student_id, first_name, last_name, email, phone, is_international]
    );
    return rows[0];
  }
};

// Policy-specific operations
const Policy = {
  async getEnrollments(studentId) {
    const { rows } = await query(
      `SELECT p.*, ip.name as plan_name 
       FROM policy_enrollments p
       JOIN insurance_plan ip ON p.plan_id = ip.id
       WHERE p.student_id = $1`,
      [studentId]
    );
    return rows;
  }
};

// Export the interface
module.exports = {
  query,
  getClient,
  testConnection,
  Student,
  Policy,
  // For testing/teardown
  pool,
};