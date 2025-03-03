const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
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

  // Sign-in API route
app.post("/api/signin", (req, res) => {
    const { email, password } = req.body;
  
    const sqlSelect = "SELECT * FROM users WHERE email = ?";
    db.query(sqlSelect, [email], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const user = result[0];
  
      // Directly compare the password from input with the database stored password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error comparing passwords" });
        }
  
        if (isMatch) {
          // First, check if the user is a student by looking in personal_details table
          const sqlGetStudent = "SELECT * FROM personal_details WHERE email = ?";
          db.query(sqlGetStudent, [user.email], (err, studentResult) => {
            if (err) {
              console.error("Error fetching student details:", err);
              return res.status(500).send("Error fetching student data");
            }
  
            // Fetch committee details from profile_committee table if the user is a committee member
            const sqlGetCommittee = "SELECT * FROM profile_committee WHERE email = ?";
            db.query(sqlGetCommittee, [user.email], (err, committeeResult) => {
              if (err) {
                console.error("Error fetching committee details:", err);
                return res.status(500).send("Error fetching committee data");
              }
  
              // Generate JWT token
              const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: "1h",
              });
  
              const response = {
                message: "Login successful",
                token,
                role: user.role,
              };
  
              // If student details exist, add them to the response
              if (studentResult.length > 0) {
                response.student = studentResult[0];
              }
  
              // If committee details exist, add them to the response
              if (committeeResult.length > 0) {
                response.committee = {
                  fullname: committeeResult[0].fullname,
                  email: committeeResult[0].email,
                  phone_no: committeeResult[0].phone_no,
                  national_id: committeeResult[0].national_id,
                  subcounty: committeeResult[0].subcounty,
                  ward: committeeResult[0].ward,
                  position: committeeResult[0].position,
                };
              }
  
              res.status(200).json(response);
            });
          });
        } else {
          res.status(401).json({ message: "Invalid email or password" });
        }
      });
    });
  });
// Endpoint to fetch student details
app.get("/api/student", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Token is required");
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized access");
  
      const sqlGet = `
      SELECT fullname, email, subcounty, ward, village, 
      DATE_FORMAT(birth, '%Y-%m-%d') AS birth, 
      gender, institution, year, admission, status, bursary
      FROM personal_details 
      WHERE email = ?
      `;
      db.query(sqlGet, [decoded.email], (err, students) => {
        if (err) {
          console.error("Error fetching data:", err);
          return res.status(500).send("Error fetching data");
        }
        res.json(students[0]); // Only return the specific student's details
      });
    });
  });
  

  // PUT route to update student profile
app.put("/api/student/update", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Token is required");
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized access");
  
      const { fullname, email, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;
  
      // Convert birth to 'YYYY-MM-DD' format if it exists
      const formattedBirth = birth ? new Date(birth).toISOString().split("T")[0] : null;
  
      const sqlUpdate = `
        UPDATE personal_details 
        SET fullname = ?, email = ?, subcounty = ?, ward = ?, village = ?, birth = ?, gender = ?, institution = ?, year = ?, admission = ? 
        WHERE email = ?
      `;
  
      db.query(
        sqlUpdate,
        [fullname, email, subcounty, ward, village, formattedBirth, gender, institution, year, admission, decoded.email],
        (err, result) => {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).send("Error updating data");
          }
          res.send({ message: "Profile updated successfully", data: req.body });
        }
      );
    });
  });
  
// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
console.log("server is running on port 5000");
});

// Export the app for serverless deployment
module.exports = app;
