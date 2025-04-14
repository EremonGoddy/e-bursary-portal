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

// ✅ Example route to test DB and server
app.get("/", async (req, res) => {
  res.send("🚀 Backend is running and connected to PostgreSQL.");
});

// ✅ Start the server using Render's dynamic PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
