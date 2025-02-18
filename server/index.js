const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Goddinare3458##',
  database: 'ebursary',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Example API route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Export the app for serverless deployment
module.exports = app;