const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Goddinare3458##",
  database: "ebursary",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Secret for JWT
const secret = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // userId and email will be available in req.user
    next();
  });
};

// Verify current password API
app.get("/api/verify-password", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { password } = req.query;

  try {
    const [result] = await db.promise().query("SELECT password FROM users WHERE id = ?", [userId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = result[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Password verified" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Export the app for serverless deployment
module.exports = app;
