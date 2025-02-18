const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const serverless = require("serverless-http");

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

  // Admin details route
app.get("/api/admin-details", (req, res) => {
    const sql = "SELECT name, email FROM users WHERE role = ?";
    const role = "Admin"; // Define the role you want to query.
  
    db.query(sql, [role], (err, result) => {
      if (err) {
        console.error("Error fetching admin details:", err);
        return res.status(500).json({ message: "Server error" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      res.status(200).json(result[0]); // Return the first matching admin.
    });
  });
  
  // Endpoint for forgot password
app.post('/api/forgot-password', async (req, res) => {
    const { identifier } = req.body;
  
    if (!identifier) {
      return res.status(400).json({ error: 'Email is required.' });
    }
  
    // Generate a random 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
    try {
      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASSWORD, // Your email password or app password
        },
      });
  
      // Email options
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: identifier, // User's email
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${resetCode}`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
  
      console.log(`Reset code sent to ${identifier}: ${resetCode}`);
      res.status(200).json({ message: 'Reset code sent successfully.' });
  
      // Save reset code to the database or in-memory store (not implemented here)
      // This step ensures you can validate the code when the user submits it
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send reset code. Please try again later.' });
    }
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
  
  // Endpoint to fetch report details
  app.get("/api/reports", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).send("Token is required");
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).send("Unauthorized access");
  
      const sqlGet = `
      SELECT 
      CONCAT('REFXE', LPAD(user_id, 2, '0')) AS reference_number,  -- Generate the reference number
      fullname, 
      email, 
      subcounty, 
      ward, 
      village, 
      DATE_FORMAT(birth, '%Y-%m-%d') AS birth, 
      gender, 
      institution, 
      year, 
      admission, 
      status, 
      bursary
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
  
  // GET route to fetch allocated and remaining funds
  app.get("/api/committee-count", (req, res) => {
    const queryTotalFunds = "SELECT amount FROM bursary_funds WHERE id = 1";
    const queryAllocatedFunds = "SELECT SUM(bursary) AS total_allocated FROM personal_details";
  
    db.query(queryTotalFunds, (err, totalResult) => {
      if (err) {
        return res.status(500).send({ error: "Error fetching total funds" });
      }
  
      if (totalResult.length > 0) {
        const totalAmount = totalResult[0].amount;
  
        db.query(queryAllocatedFunds, (err, allocatedResult) => {
          if (err) {
            return res.status(500).send({ error: "Error fetching allocated funds" });
          }
  
          const allocatedAmount = allocatedResult[0].total_allocated || 0;
          const remainingAmount = totalAmount - allocatedAmount;
  
          res.status(200).json({
            amount: totalAmount,
            allocated: allocatedAmount,
            remaining: remainingAmount,
          });
        });
      } else {
        res.status(404).json({ error: "No bursary fund found" });
      }
    });
  });

  // Route to get quick statistics (total, approved, rejected)
app.get("/api/quick-statistics", (req, res) => {
    const queryTotal = "SELECT COUNT(*) AS total FROM personal_details";
    const queryApproved = 'SELECT COUNT(*) AS approved FROM personal_details WHERE status = "approved"';
    const queryRejected = 'SELECT COUNT(*) AS rejected FROM personal_details WHERE status = "rejected"';
  
    db.query(queryTotal, (err, totalResult) => {
      if (err) {
        return res.status(500).send({ error: "Error fetching total applications" });
      }
  
      const totalApplications = totalResult[0].total;
  
      db.query(queryApproved, (err, approvedResult) => {
        if (err) {
          return res.status(500).send({ error: "Error fetching approved applications" });
        }
  
        const approvedApplications = approvedResult[0].approved;
  
        db.query(queryRejected, (err, rejectedResult) => {
          if (err) {
            return res.status(500).send({ error: "Error fetching rejected applications" });
          }
  
          const rejectedApplications = rejectedResult[0].rejected;
  
          res.status(200).json({ total: totalApplications, approved: approvedApplications, rejected: rejectedApplications });
        });
      });
    });
  });
  
  // Route to fetch all personal information
  app.get("/api/personalInformation", (req, res) => {
    const sqlGet = "SELECT * FROM personal_details";
    db.query(sqlGet, (error, result) => {
      res.send(result);
    });
  });
  
  // Route to fetch personal information for a specific user
  app.get("/api/personalInformation/:id", (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    console.log(userId);
    const sqlGet = "SELECT * FROM personal_details WHERE user_id = ?";
  
    db.query(sqlGet, [userId], (error, result) => {
      if (error) {
        console.error("Error fetching family and personal details:", error);
        res.status(500).send("Error fetching data");
      } else {
        res.send(result); // Send the result of the joined tables
      }
    });
  });
  
  // Route to fetch amount information for a specific user
  app.get("/api/amountInformation/:id", (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    console.log(userId);
    const sqlGet = `
      SELECT 
        ad.*, pd.fullname, pd.admission, pd.institution 
      FROM 
        amount_details ad
      JOIN 
        personal_details pd 
      ON 
        ad.user_id = pd.user_id
      WHERE 
        pd.user_id = ?
    `; // Join family_details with personal_details using the admission number
  
    db.query(sqlGet, [userId], (error, result) => {
      if (error) {
        console.error("Error fetching family and personal details:", error);
        res.status(500).send("Error fetching data");
      } else {
        res.send(result); // Send the result of the joined tables
      }
    });
  });
  
 // Route to get family information for a specific user
app.get("/api/familyInformation/:id", (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    console.log("User ID:", userId);
    const sqlGet = `
      SELECT 
        fd.*, pd.fullname, pd.admission, pd.institution 
      FROM 
        family_details fd
      JOIN 
        personal_details pd 
      ON 
        fd.user_id = pd.user_id
      WHERE pd.user_id = ?
    `; // Join family_details with personal_details using the user_id
    
    db.query(sqlGet, [userId], (error, result) => {
      if (error) {
        console.error("Error fetching family and personal details:", error);
        res.status(500).send("Error fetching data");
      } else {
        res.send(result); // Send the result of the joined tables
      }
    });
  });
  
  // Route to get disclosure information for a specific user
  app.get("/api/disclosureInformation/:id", (req, res) => {
    const userId = req.params.id; // Get the user ID from the request parameters
    console.log("User ID:", userId);
    const sqlGet = `
      SELECT 
        dd.*, pd.fullname, pd.admission, pd.institution 
      FROM 
        disclosure_details dd
      JOIN 
        personal_details pd 
      ON 
        dd.user_id = pd.user_id
      WHERE pd.user_id = ?
    `; // Join disclosure_details with personal_details using the user_id
  
    db.query(sqlGet, [userId], (error, result) => {
      if (error) {
        console.error("Error fetching disclosure and personal details:", error);
        res.status(500).send("Error fetching data");
      } else {
        res.send(result); // Send the result of the joined tables
      }
    });
  });
  
// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Export the app for serverless deployment
module.exports.handler = serverless(app);
