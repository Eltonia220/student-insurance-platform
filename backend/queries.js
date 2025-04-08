import db from './db.js';

// Create
export const createPlan = async (name, price, coverage) => {
  const { rows } = await db.query(
    `INSERT INTO insurance_plans (name, price, coverage)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, price, coverage]
  );
  return rows[0];
};

// Read
export const getPlans = async (maxPrice) => {
  const query = maxPrice
    ? `SELECT * FROM insurance_plans WHERE price <= $1`
    : `SELECT * FROM insurance_plans`;
    
  const { rows } = await db.query(query, maxPrice ? [maxPrice] : []);
  return rows;
};

// Update
export const updatePlan = async (id, updates) => {
  const { name, price, coverage } = updates;
  const { rows } = await db.query(
    `UPDATE insurance_plans 
     SET name = $1, price = $2, coverage = $3 
     WHERE id = $4 RETURNING *`,
    [name, price, coverage, id]
  );
  return rows[0];
};

// Delete
export const deletePlan = async (id) => {
  await db.query('DELETE FROM insurance_plans WHERE id = $1', [id]);
};