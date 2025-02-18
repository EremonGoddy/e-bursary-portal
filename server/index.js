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

app.post("/api/post", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const sqlInsert = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(sqlInsert, [name, email, hashedPassword, role], (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error inserting user" });
        }
        res.status(200).json({ message: "Admin registered successfully" });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST API routes
app.post('/api/personal-details', (req, res) => {
    const { fullname, email, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;
    const sql = `INSERT INTO personal_details (fullname, email, subcounty, ward, village, birth, gender, institution, year, admission) 
    VALUES (?,?,?,?,?,?,?,?,?,?)`;
  
    db.query(sql, [fullname, email, subcounty, ward, village, birth, gender, institution, year, admission], (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res.json({ message: 'Data inserted successfully', userId: result.insertId });
      }
    });
  });
  
  app.post('/api/amount-details', (req, res) => {
    const { userId, payablewords, payablefigures, outstandingwords, outstandingfigures, accountname, accountnumber, branch } = req.body;
    const sql = `INSERT INTO amount_details (user_id, payable_words, payable_figures, outstanding_words, outstanding_figures, school_accountname, school_accountnumber, school_branch) 
    VALUES (?,?,?,?,?,?,?,?)`;
  
    db.query(sql, [userId, payablewords, payablefigures, outstandingwords, outstandingfigures, accountname, accountnumber, branch], (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res.send('Data inserted successfully');
      }
    });
  });
  
  app.post('/api/family-details', (req, res) => {
    const { userId, family_status, disability, parentname, relationship, contact, occupation, guardian_children, working_siblings, studying_siblings, monthly_income } = req.body;
    const sql = `INSERT INTO family_details (user_id, family_status, disability, parent_guardian_name, relationship, contact_info, occupation, guardian_children, working_siblings, studying_siblings, monthly_income) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
  
    db.query(sql, [userId, family_status, disability, parentname, relationship, contact, occupation, guardian_children, working_siblings, studying_siblings, monthly_income], (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res.send('Data inserted successfully');
      }
    });
  });
  
  app.post('/api/disclosure-details', (req, res) => {
    const { userId, bursary, bursarysource, bursaryamount, helb, granted, noreason } = req.body;
    const sql = `INSERT INTO disclosure_details (user_id, receiving_bursary, bursary_source, bursary_amount, applied_helb, helb_outcome, helb_noreason) 
    VALUES (?,?,?,?,?,?,?)`;
  
    db.query(sql, [userId, bursary, bursarysource, bursaryamount, helb, granted, noreason], (err, result) => {
      if (err) {
        console.error('Error inserting data: ', err);
        res.status(500).send('Server error');
      } else {
        res.send('Data inserted successfully');
      }
    });
  });

  

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Export the app for serverless deployment
module.exports = app;
