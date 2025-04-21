import bcrypt from 'bcrypt';
import { db } from '../backend/services/db.js';  // Correct path
 // Adjusted path to db.js
 // Assuming you have a db module to interact with the database

const password = 'Ell224y2027'; // Replace with the password you want to hash
const saltRounds = 10;

async function addUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user details along with the hashed password into the database
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [
      'eltonianyingi@gmail.com', // Email
      hashedPassword, // Hashed password
      'Elton', // First name
      'Nyingi', // Last name
      '254703411608', // Phone number
    ];

    // Run the query to insert the user
    await db.query(query, values);

    console.log('User successfully added with hashed password!');
  } catch (err) {
    console.error('Error adding user:', err);
  }
}

// Run the function to add the user
addUser();
