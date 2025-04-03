const express = require("express");
const app = express();
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const multer = require('multer');

const db = new Pool({
  user: "postgres", // Your PostgreSQL username
  host: "localhost",
  database: "ebursary", // Your database name
  password: "Goddinare3458", // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Connection error", err));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT Secret
const secret = "your_jwt_secret";

// ✅ Middleware to authenticate JWT
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

// ✅ Verify current password API (PostgreSQL)
app.get("/api/verify-password", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { password } = req.query;

  try {
    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);
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

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Query user from the users table
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Fetch student details if the user is a student
    const studentQuery = 'SELECT * FROM personal_details WHERE email = $1';
    const studentResult = await db.query(studentQuery, [email]);

    // Fetch committee details if the user is a committee member
    const committeeQuery = 'SELECT * FROM profile_committee WHERE email = $1';
    const committeeResult = await db.query(committeeQuery, [email]);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });

    // Build response
    const response = {
      message: 'Login successful',
      token,
      role: user.role,
      name: user.name, // Include name from users table
    };

    // Add student details if they exist
    if (studentResult.rows.length > 0) {
      response.student = studentResult.rows[0];
    }

    // Add committee details if they exist
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
    console.error('Error in /api/signin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Change password API (PostgreSQL)
app.post("/api/change-password", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await db.query("SELECT password FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(currentPassword, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Register a new user (PostgreSQL)
app.post("/api/post", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role]
    );

    res.status(200).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error inserting user:", error);CD
    res.status(500).json({ message: "Error inserting user" });
  }
});

// ✅ Insert Personal Details (PostgreSQL)
app.post("/api/personal-details", async (req, res) => {
  const { fullname, email, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO personal_details (fullname, email, subcounty, ward, village, birth, gender, institution, year, admission) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING user_id",
      [fullname, email, subcounty, ward, village, birth, gender, institution, year, admission]
    );
    
    const userId = result.rows[0].user_id;
    console.log("Inserted user_id:", userId); // Debugging statement
    res.json({ message: "Data inserted successfully", userId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Server error");
  }
});

// ✅ Insert Amount Details (PostgreSQL)
app.post("/api/amount-details", async (req, res) => {
  const { userId, payablewords, payablefigures, outstandingwords, outstandingfigures, accountname, accountnumber, branch } = req.body;

  // Debugging statement
  console.log("Received userId:", userId);

  if (!userId) {
    return res.status(400).send("Missing userId");
  }

  try {
    await db.query(
      "INSERT INTO amount_details (user_id, payable_words, payable_figures, outstanding_words, outstanding_figures, school_accountname, school_accountnumber, school_branch) OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [userId, payablewords, payablefigures, outstandingwords, outstandingfigures, accountname, accountnumber, branch]
    );

    res.send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Server error");
  }
});

// ✅ Insert Family Details (PostgreSQL)
app.post("/api/family-details", async (req, res) => {
  const { userId, family_status, disability, parentname, relationship, contact, occupation, guardian_children, working_siblings, studying_siblings, monthly_income } = req.body;

  // Debugging statement
  console.log("Received userId:", userId);

  if (!userId) {
    return res.status(400).send("Missing userId");
  }

  try {
    await db.query(
      "INSERT INTO family_details (user_id, family_status, disability, parent_guardian_name, relationship, contact_info, occupation, guardian_children, working_siblings, studying_siblings, monthly_income) OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [userId, family_status, disability, parentname, relationship, contact, occupation, guardian_children, working_siblings, studying_siblings, monthly_income]
    );

    res.send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Server error");
  }
});

// ✅ Insert Disclosure Details (PostgreSQL)
app.post("/api/disclosure-details", async (req, res) => {
  const { userId, bursary, bursarysource, bursaryamount, helb, granted, noreason } = req.body;

  // Debugging statement
  console.log("Received userId:", userId);

  if (!userId) {
    return res.status(400).send("Missing userId");
  }

  try {
    await db.query(
      "INSERT INTO disclosure_details (user_id, receiving_bursary, bursary_source, bursary_amount, applied_helb, helb_outcome, helb_noreason) OVERRIDING SYSTEM VALUE VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [userId, bursary, bursarysource, bursaryamount, helb, granted, noreason]
    );

    res.send("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).send("Server error");
  }
});
app.get('/api/admin-details', async (req, res) => {
  const sql = 'SELECT name, email FROM users WHERE role = $1';
  const role = 'Admin'; // Define the role you want to query.

  try {
    const result = await db.query(sql, [role]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(result.rows[0]); // Return the first matching admin.
  } catch (err) {
    console.error('Error fetching admin details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/forgot-password', async (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Generate a random 6-digit reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Check if the email exists in the database
    const userQuery = 'SELECT id FROM users WHERE email = $1';
    const userResult = await db.query(userQuery, [identifier]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userId = userResult.rows[0].id;

    // Save the reset code to the database
    const insertQuery = `
      INSERT INTO password_resets (user_id, reset_code, created_at) 
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id) DO UPDATE 
      SET reset_code = EXCLUDED.reset_code, created_at = NOW()
    `;
    await db.query(insertQuery, [userId, resetCode]);

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
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
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send reset code. Please try again later.' });
  }
});

app.get('/api/student', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token is required' });

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized access' });

    try {
      const sqlGet = `
        SELECT fullname, email, subcounty, ward, village, 
        TO_CHAR(birth, 'YYYY-MM-DD') AS birth, 
        gender, institution, year, admission, status, bursary
        FROM personal_details 
        WHERE email = $1
      `;
      const result = await db.query(sqlGet, [decoded.email]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(result.rows[0]); // Return the specific student's details
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });
});

app.get('/api/reports', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).send('Unauthorized access');

      const sqlGet = `
          SELECT 
              'REFXE' || LPAD(user_id::TEXT, 2, '0') AS reference_number, 
              fullname, 
              email, 
              subcounty, 
              ward, 
              village, 
              TO_CHAR(birth, 'YYYY-MM-DD') AS birth, 
              gender, 
              institution, 
              year, 
              admission, 
              status, 
              bursary
          FROM personal_details 
          WHERE email = $1
      `;

      db.query(sqlGet, [decoded.email], (err, result) => {
          if (err) {
              console.error('Error fetching data:', err);
              return res.status(500).send('Error fetching data');
          }
          if (result.rows.length === 0) {
              return res.status(404).json({ message: 'No records found' });
          }
          res.json(result.rows[0]); // Return the specific student's details
      });
  });
});

app.put('/api/student/update', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).send('Unauthorized access');

      const { fullname, email, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;

      // Format birth date to 'YYYY-MM-DD' if it exists
      const formattedBirth = birth ? new Date(birth).toISOString().split('T')[0] : null;

      const sqlUpdate = `
          UPDATE personal_details 
          SET fullname = $1, email = $2, subcounty = $3, ward = $4, village = $5, birth = $6, 
              gender = $7, institution = $8, year = $9, admission = $10
          WHERE email = $11
          RETURNING *;
      `;

      db.query(
          sqlUpdate,
          [fullname, email, subcounty, ward, village, formattedBirth, gender, institution, year, admission, decoded.email],
          (err, result) => {
              if (err) {
                  console.error('Error updating data:', err);
                  return res.status(500).send('Error updating data');
              }
              if (result.rowCount === 0) {
                  return res.status(404).send('User not found');
              }
              res.send({ message: 'Profile updated successfully', data: result.rows[0] });
          }
      );
  });
});

app.get('/api/committee-count', (req, res) => {
  const queryTotalFunds = 'SELECT amount FROM bursary_funds WHERE id = $1';
  const queryAllocatedFunds = 'SELECT COALESCE(SUM(bursary), 0) AS total_allocated FROM personal_details';

  db.query(queryTotalFunds, [1], (err, totalResult) => {
      if (err) {
          console.error('Error fetching total funds:', err);
          return res.status(500).json({ error: 'Error fetching total funds' });
      }

      if (totalResult.rowCount > 0) {
          const totalAmount = totalResult.rows[0].amount;

          db.query(queryAllocatedFunds, (err, allocatedResult) => {
              if (err) {
                  console.error('Error fetching allocated funds:', err);
                  return res.status(500).json({ error: 'Error fetching allocated funds' });
              }

              const allocatedAmount = allocatedResult.rows[0].total_allocated || 0;
              const remainingAmount = totalAmount - allocatedAmount;

              res.status(200).json({
                  amount: totalAmount,
                  allocated: allocatedAmount,
                  remaining: remainingAmount
              });
          });
      } else {
          res.status(404).json({ error: 'No bursary fund found' });
      }
  });
});

app.get('/api/quick-statistics', async (req, res) => {
  try {
      const queryTotal = 'SELECT COUNT(*) AS total FROM personal_details';
      const queryApproved = "SELECT COUNT(*) AS approved FROM personal_details WHERE status = 'approved'";
      const queryRejected = "SELECT COUNT(*) AS rejected FROM personal_details WHERE status = 'rejected'";

      // Execute queries in parallel for better performance
      const [totalResult, approvedResult, rejectedResult] = await Promise.all([
          db.query(queryTotal),
          db.query(queryApproved),
          db.query(queryRejected)
      ]);

      // Extract values
      const totalApplications = totalResult.rows[0].total;
      const approvedApplications = approvedResult.rows[0].approved;
      const rejectedApplications = rejectedResult.rows[0].rejected;

      // Send response
      res.status(200).json({
          total: totalApplications,
          approved: approvedApplications,
          rejected: rejectedApplications
      });

  } catch (err) {
      console.error('Error fetching statistics:', err);
      res.status(500).json({ error: 'Error fetching statistics' });
  }
});


app.get("/api/personalInformation", async (req, res) => {
  try {
      const sqlGet = "SELECT * FROM personal_details";
      const result = await db.query(sqlGet); // PostgreSQL query execution
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching personal details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/api/personalInformation/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters
  console.log(userId);

  const sqlGet = "SELECT * FROM personal_details WHERE user_id = $1";

  try {
      const result = await db.query(sqlGet, [userId]); // PostgreSQL parameterized query
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(result.rows[0]); // Return the specific user data
  } catch (error) {
      console.error("Error fetching personal details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/api/amountInformation/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from request parameters
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
      WHERE pd.user_id = $1
  `; 

  try {
      const result = await db.query(sqlGet, [userId]); // PostgreSQL query execution
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching amount and personal details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

app.get("/api/familyInformation/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from request parameters
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
      WHERE pd.user_id = $1
  `; 

  try {
      const result = await db.query(sqlGet, [userId]); // PostgreSQL query execution
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching family and personal details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});


// Get disclosure information
app.get("/api/disclosureInformation/:id", async (req, res) => {
  const userId = req.params.id; // Get the user ID from request parameters
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
      WHERE pd.user_id = $1
  `; 

  try {
      const result = await db.query(sqlGet, [userId]); // PostgreSQL query execution
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching disclosure and personal details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique file name
  },
});

const upload = multer({ storage: storage });

// API endpoint to handle file uploads
app.post('/api/upload', upload.single('document'), async (req, res) => {
  const { documentName } = req.body;
  const document = req.file;

  if (!document) {
      return res.status(400).send('No file uploaded');
  }

  const query = `INSERT INTO uploaded_document (document_name, file_path) VALUES ($1, $2) RETURNING *`;

  try {
      const result = await db.query(query, [documentName, document.path]); // PostgreSQL query execution
      res.status(200).json({ message: 'File uploaded and saved to database successfully', data: result.rows[0] });
  } catch (error) {
      console.error('Error saving to database:', error);
      res.status(500).json({ error: 'Database error' });
  }
});

// Get uploaded document details for a user
app.get("/api/get-document/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("User ID:", userId);

  const sqlGet = `
      SELECT 
          ud.*, pd.fullname, pd.admission, pd.institution 
      FROM 
          uploaded_document ud
      JOIN 
          personal_details pd 
      ON 
          ud.user_id = pd.user_id
      WHERE pd.user_id = $1
  `;

  try {
      const result = await db.query(sqlGet, [userId]); // PostgreSQL query execution
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "No documents found for this user" });
      }
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching document and personal details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

// Update user status (Approve/Reject) in the personal_details table
app.put('/api/update-status/:id', async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body; // Status is sent from the frontend (Approve or Reject)

  const query = 'UPDATE personal_details SET status = $1 WHERE user_id = $2 RETURNING *';

  try {
      const result = await db.query(query, [status, userId]);
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: `Status updated to ${status}`, data: result.rows[0] });
  } catch (error) {
      console.error("Error updating status:", error);
      res.status(500).json({ error: "Error updating status" });
  }
});

// Get bursary details for a user
app.get("/api/get-bursary/:id", async (req, res) => {
  const userId = req.params.id;
  console.log("User ID:", userId);

  const sqlGet = `
      SELECT 
          ud.*, pd.fullname, pd.admission, pd.institution 
      FROM 
          uploaded_document ud
      JOIN 
          personal_details pd 
      ON 
          ud.user_id = pd.user_id
      WHERE pd.user_id = $1
  `;

  try {
      const result = await db.query(sqlGet, [userId]); // PostgreSQL query execution
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "No bursary details found for this user" });
      }
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching bursary details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

// Get all bursary details
app.get("/api/get-bursary", async (req, res) => {
  const sqlGetAll = `
      SELECT 
          ud.*, pd.fullname, pd.admission, pd.institution 
      FROM 
          uploaded_document ud
      JOIN 
          personal_details pd 
      ON 
          ud.user_id = pd.user_id
  `;

  try {
      const result = await db.query(sqlGetAll);
      res.status(200).json(result.rows); // Use `.rows` to return data
  } catch (error) {
      console.error("Error fetching bursary details:", error);
      res.status(500).json({ error: "Error fetching data" });
  }
});

// Update user bursary and allocation date
app.put('/api/update-bursary/:id', async (req, res) => {
  const userId = req.params.id;
  const { bursary } = req.body;

  const query = `
      UPDATE personal_details 
      SET bursary = $1, allocation_date = CURRENT_TIMESTAMP 
      WHERE user_id = $2
      RETURNING *
  `;

  try {
      const result = await db.query(query, [bursary, userId]);
      if (result.rowCount === 0) {
          return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
          message: `Allocated Ksh ${bursary} on ${new Date().toISOString()}`, 
          data: result.rows[0] 
      });
  } catch (error) {
      console.error("Error updating bursary and date:", error);
      res.status(500).json({ error: "Error updating bursary and date" });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  const query = 'SELECT * FROM users';

  try {
      const result = await db.query(query);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error fetching users" });
  }
});

// Add a new user
app.post('/api/users', async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id';
      const result = await db.query(query, [fullname, email, hashedPassword, role]);

      // Insert into activity logs
      const logQuery = 'INSERT INTO activity_log (log_message) VALUES ($1)';
      await db.query(logQuery, [`Added new user ${fullname}`]);

      res.status(201).json({ message: "User added", userId: result.rows[0].user_id });
  } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ error: "Error adding user" });
  }
});

// DELETE a user and log the action
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
      // First, fetch the user's full name before deletion
      const selectQuery = 'SELECT name FROM users WHERE id = $1';
      const selectResult = await db.query(selectQuery, [userId]);

      if (selectResult.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const userFullName = selectResult.rows[0].fullname;

      // Delete the user
      const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const deleteResult = await db.query(deleteQuery, [userId]);

      if (deleteResult.rowCount === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Log the deletion in activity logs
      const logQuery = 'INSERT INTO activity_log (log_message) VALUES ($1)';
      await db.query(logQuery, [`Deleted user ${userFullName}`]);

      res.status(200).json({ message: 'User deleted successfully' });

  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error deleting user' });
  }
});

// GET all activity logs
app.get('/api/activity-logs', async (req, res) => {
  const query = 'SELECT * FROM activity_log ORDER BY log_time DESC'; // Optional: Order by timestamp

  try {
      const result = await db.query(query);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching activity logs:', error);
      res.status(500).json({ error: 'Error fetching activity logs' });
  }
});

// Disburse new bursary funds
app.post('/api/bursary-funds', async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: 'Invalid amount provided' });
  }

  const query = 'INSERT INTO bursary_funds (amount) VALUES ($1) RETURNING *';

  try {
      await db.query(query, [amount]);
      res.status(200).json({ message: 'Funds disbursed successfully' });
  } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Update bursary fund allocation
app.put('/api/adjust-funds', async (req, res) => {
  const { amount } = req.body;
  const id = 1; // Assuming there's only one row in the bursary_funds table

  const updateQuery = 'UPDATE bursary_funds SET amount = $1 WHERE id = $2';

  try {
      await db.query(updateQuery, [amount, id]);
      res.status(200).json({ message: 'Fund allocation adjusted successfully!' });
  } catch (error) {
      console.error('Error updating fund allocation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API to fetch user report by ID
app.get('/api/user-report/:id', async (req, res) => {
  const query = `
      SELECT fullname, admission_number AS admission, institution, status, 
      bursary AS amountAllocated
      FROM personal_details 
      WHERE user_id = $1;
  `;

  const userId = req.params.id; // Get user ID from the URL parameter

  try {
      const result = await db.query(query, [userId]);

      if (result.rows.length > 0) {
          res.json(result.rows[0]);
      } else {
          res.status(404).json({ error: 'User not found' });
      }
  } catch (error) {
      console.error('Error fetching user data:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get committee profile
app.get('/api/profile-committee', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Token is required');

  try {
      const decoded = jwt.verify(token, secret);
      const sqlGet = `
          SELECT fullname, email, phone_no, national_id, subcounty, ward, position, 
              CASE 
                  WHEN fullname IS NULL OR phone_no IS NULL OR national_id IS NULL THEN 0
                  ELSE 1
              END AS is_complete
          FROM profile_committee 
          WHERE email = $1
      `;

      const result = await db.query(sqlGet, [decoded.email]);

      if (result.rows.length === 0) {
          return res.status(404).send('Profile not found');
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error fetching committee data:', error);
      res.status(500).send('Error fetching data');
  }
});

// Create committee profile
app.post('/api/profile-form', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Token is required');

  try {
      const decoded = jwt.verify(token, secret);
      const { fullname, phone_no, national_id, subcounty, ward, position } = req.body;

      if (!fullname || !phone_no || !national_id || !subcounty || !ward || !position) {
          return res.status(400).send('All profile fields are required');
      }

      const email = decoded.email;

      const sqlInsert = `
          INSERT INTO profile_committee (fullname, email, phone_no, national_id, subcounty, ward, position) 
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;

      const result = await db.query(sqlInsert, [
          fullname,
          email,
          phone_no,
          national_id,
          subcounty,
          ward,
          position
      ]);

      res.status(201).send({
          message: 'Profile created successfully',
          data: result.rows[0]
      });
  } catch (error) {
      console.error('Error inserting committee data:', error);
      res.status(500).send('Error submitting data');
  }
});

app.get('/api/comreport', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  try {
      const decoded = jwt.verify(token, secret);
      const sqlGet = `
          SELECT 
              CONCAT('REFNO', LPAD(CAST(id AS TEXT), 2, '0')) AS reference_number, 
              fullname, 
              email,
              phone_no,
              national_id,
              subcounty, 
              ward, 
              position
          FROM profile_committee 
          WHERE email = $1
      `;

      const result = await db.query(sqlGet, [decoded.email]);

      if (result.rows.length === 0) {
          return res.status(404).send('Profile not found');
      }

      res.json(result.rows[0]); // Return only the specific user's details
  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
  }
});


// ✅ Start the server
app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});
