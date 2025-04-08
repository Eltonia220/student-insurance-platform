import bcrypt from "bcryptjs";

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Run this to get hashed password for your mock users
hashPassword("password123").then(console.log);
