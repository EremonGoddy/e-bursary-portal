const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config();

// Create a new pool of connections
const pool = new Pool({
  host: process.env.DATABASE_HOST,       // Database host from Render
  port: parseInt(process.env.DATABASE_PORT, 10), // Port should be a number
  user: process.env.DATABASE_USER,       // Database username
  password: process.env.DATABASE_PASSWORD, // Database password
  database: process.env.DATABASE_NAME,   // Database name
  ssl: {
    rejectUnauthorized: false,           // Necessary for connecting to Render's managed databases
  }
});

// Function to test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to the PostgreSQL database!');
    client.release();
  } catch (err) {
    console.error('❌ Error connecting to the PostgreSQL database:', err.stack);
  }
};

testConnection();

module.exports = pool;
