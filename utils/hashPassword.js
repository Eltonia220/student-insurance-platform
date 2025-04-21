import bcrypt from 'bcrypt';

// Define the password you want to hash
const password = 'Ell224y2026'; // Replace with the password you want to hash

// Define the number of salt rounds for bcrypt (higher value = more secure)
const saltRounds = 10;

async function hashPassword() {
  try {
    // Generate a salt and hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('Hashed Password:', hashedPassword);

    // Now you can store the hashed password in your database
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

// Run the function
hashPassword();
