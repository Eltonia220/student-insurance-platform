import express from 'express';
import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';
import cors from 'cors';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'student_insurer',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'student_aggregator_',
  password: process.env.DB_PASSWORD || 'Ell224y2026',
  port: process.env.DB_PORT || 5432,
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

// Check if tables exist
app.get('/api/check-tables', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'insurance_plans'
      )
    `);
    res.json({ tableExists: rows[0].exists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all insurance plans
app.get('/api/plans', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, price, coverage, provider 
      FROM insurance_plans
      ORDER BY price
    `);
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'No insurance plans found',
        suggestion: 'Please add some plans to the database'
      });
    }
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ 
      error: 'Failed to fetch insurance plans',
      details: err.message
    });
  }
});

// Get single plan by ID
app.get('/api/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM insurance_plans WHERE id = $1', 
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Access plans at http://localhost:${PORT}/api/plans`);
});