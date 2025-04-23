// Load environment variables
require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");

// ✅ Use the external PostgreSQL config
const db = require("./db-config");

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ JWT Secret from .env or fallback
const secret = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ Authenticate JWT Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// ✅ Example route to test DB and server
app.get("/", (req, res) => {
  res.send("🚀 Backend is running and connected to PostgreSQL.");
});

// ✅ Verify current password API
app.get("/api/verify-password", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { password } = req.query;

  try {
    const result = await db.query("SELECT password FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = result.rows[0].password;
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

// ✅ Signin route
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const studentResult = await db.query("SELECT * FROM personal_details WHERE email = $1", [email]);
    const committeeResult = await db.query("SELECT * FROM profile_committee WHERE email = $1", [email]);

    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "1h" });

    const response = {
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    };

    if (studentResult.rows.length > 0) {
      response.student = studentResult.rows[0];
    }

    if (committeeResult.rows.length > 0) {
      const committee = committeeResult.rows[0];
      response.committee = {
        fullname: committee.fullname,
        email: committee.email,
        phone_no: committee.phone_no,
        national_id: committee.national_id,
        subcounty: committee.subcounty,
        ward: committee.ward,
        position: committee.position,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in /api/signin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Register a new user (PostgreSQL)
app.post("/api/post", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    // Respond with the created user data
    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ message: "Server error while registering user" });
  }
});

// ✅ Change password API
app.post("/api/change-password", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await db.query("SELECT password FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, userId]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
