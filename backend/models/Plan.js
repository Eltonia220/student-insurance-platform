const db = require('../db');

class Plan {
  static async create({ name, description, price, coverage_types }) {
    const { rows } = await db.query(
      `INSERT INTO plans (name, description, price, coverage_types) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, coverage_types]
    );
    return rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM plans WHERE 1=1';
    const params = [];
    
    if (filters.minPrice) {
      params.push(filters.minPrice);
      query += ` AND price >= $${params.length}`;
    }
    
    if (filters.maxPrice) {
      params.push(filters.maxPrice);
      query += ` AND price <= $${params.length}`;
    }
    
    if (filters.coverageType) {
      params.push(filters.coverageType);
      query += ` AND $${params.length} = ANY(coverage_types)`;
    }
    
    const { rows } = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT * FROM plans WHERE id = $1', [id]);
    return rows[0];
  }

  static async update(id, updates) {
    const { rows } = await db.query(
      `UPDATE plans SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        coverage_types = COALESCE($4, coverage_types),
        updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [updates.name, updates.description, updates.price, updates.coverage_types, id]
    );
    return rows[0];
  }

  static async delete(id) {
    await db.query('DELETE FROM plans WHERE id = $1', [id]);
  }
}

module.exports = Plan;