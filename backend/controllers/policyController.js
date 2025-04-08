const db = require('../db');

exports.getUserPolicies = async (req, res) => {
  try {
    const { rows: policies } = await db.query(
      `SELECT up.*, p.name as plan_name, p.coverage_types 
       FROM user_policies up
       JOIN plans p ON up.plan_id = p.id
       WHERE up.user_id = $1`,
      [req.user.id]
    );
    
    res.status(200).json({
      status: 'success',
      data: { policies }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user policies'
    });
  }
};

exports.createPolicy = async (req, res) => {
  try {
    const { plan_id, start_date, end_date } = req.body;
    
    const { rows: [policy] } = await db.query(
      `INSERT INTO user_policies 
       (user_id, plan_id, start_date, end_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, plan_id, start_date, end_date]
    );
    
    res.status(201).json({
      status: 'success',
      data: { policy }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Failed to create policy'
    });
  }
};