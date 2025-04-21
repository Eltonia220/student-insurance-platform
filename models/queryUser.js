// queryUser.js
import { db } from '../backend/services/db.js'; // Adjust path if needed

async function getUserByEmail(email) {
  try {
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (res.rows.length === 0) {
      console.log('User not found');
    } else {
      console.log('User found:', res.rows[0]);
    }
  } catch (err) {
    console.error('Error querying user:', err);
  }
}

// Test with the email of the user you added
getUserByEmail('eltonianyingi@gmail.com'); // Replace with the email of the user you want to query
