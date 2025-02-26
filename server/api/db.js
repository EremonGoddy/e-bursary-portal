const mysql = require("mysql2/promise");

// Create a database connection function
const connectDB = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Goddinare3458##",  // Changed from DB_PASS to DB_PASSWORD
    database: process.env.DB_NAME || "ebursary",
  });
};

module.exports = connectDB;

