const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config(); // For loading environment variables from a `.env` file

const db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'Goddinare3458##',
database: 'ebursary'
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Secret for JWT
const secret = 'your_jwt_secret';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Token required' });

jwt.verify(token, secret, (err, user) => {
if (err) return res.status(403).json({ message: 'Invalid token' });
req.user = user; // userId and email will be available in req.user
next();
});
};

// Verify current password API
app.get('/api/verify-password', authenticateToken, (req, res) => {
const { userId } = req.user;
const { password } = req.query;

const sqlSelect = 'SELECT password FROM users WHERE id = ?';
db.query(sqlSelect, [userId], (error, result) => {
if (error) {
console.error('Error fetching user:', error);
return res.status(500).json({ message: 'Server error' });
}

if (result.length === 0) {
return res.status(404).json({ message: 'User not found' });
}

const hashedPassword = result[0].password;

bcrypt.compare(password, hashedPassword, (err, isMatch) => {
if (err) {
console.error('Error comparing passwords:', err);
return res.status(500).json({ message: 'Error comparing passwords' });
}

if (!isMatch) {
return res.status(401).json({ message: 'Invalid password' });
}

res.status(200).json({ message: 'Password verified' });
});
});
});

// Change password API
app.post('/api/change-password', authenticateToken, (req, res) => {
const { userId } = req.user;
const { currentPassword, newPassword } = req.body;

const sqlSelect = 'SELECT password FROM users WHERE id = ?';
db.query(sqlSelect, [userId], (error, result) => {
if (error) {
console.error('Error fetching user:', error);
return res.status(500).json({ message: 'Server error' });
}

if (result.length === 0) {
return res.status(404).json({ message: 'User not found' });
}

const hashedPassword = result[0].password;

// Verify current password
bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
if (err) {
console.error('Error comparing passwords:', err);
return res.status(500).json({ message: 'Error comparing passwords' });
}

if (!isMatch) {
return res.status(401).json({ message: 'Invalid current password' });
}

// Hash new password
bcrypt.hash(newPassword, 10, (hashErr, hashedNewPassword) => {
if (hashErr) {
console.error('Error hashing password:', hashErr);
return res.status(500).json({ message: 'Error hashing new password' });
}

const sqlUpdate = 'UPDATE users SET password = ? WHERE id = ?';
db.query(sqlUpdate, [hashedNewPassword, userId], (updateErr) => {
if (updateErr) {
console.error('Error updating password:', updateErr);
return res.status(500).json({ message: 'Error updating password' });
}

res.status(200).json({ message: 'Password updated successfully' });
});
});
});
});
});


app.post("/api/post", (req,res) =>{
const {name, email, password, role} =req.body;
// Hash the password
const saltRounds = 10; // You can adjust the cost factor (10 is recommended)
bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
if (err) {
console.log(err);
return res.status(500).json({ message: 'Error hashing password' });
}

const sqlInsert= "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
db.query(sqlInsert, [name, email, hashedPassword, role], (error, result) =>{
if (error) {
console.log(error);
return res.status(500).json({ message: 'Error inserting user' });
}

res.status(200).json({ message: 'Admin registered successfully' });
});

});
});


app.post('/api/personal-details', (req, res) => {
const { fullname, email, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;
const sql = `INSERT INTO personal_details (fullname, email, subcounty, ward, village, birth, gender, institution, year, admission) 
VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;

db.query(sql, [fullname, email, subcounty, ward, village, birth, gender, institution, year, admission], (err, result) => {
if (err) {
console.error('Error inserting data: ', err);
res.status(500).send('Server error');
} else {
const userId = result.insertId;
res.json({message:'Data inserted successfully, userId '});
    }
  });
});

app.post('/api/amount-details', (req, res) => {
const { userId, payablewords, payablefigures, outstandingwords, outstandingfigures, accountname, accountnumber, branch} = req.body;
const sql = `INSERT INTO amount_details (user_id, payable_words, payable_figures, outstanding_words, outstanding_figures, school_accountname, school_accountnumber, school_branch) 
VALUES (?,?, ?, ?, ?, ?, ?, ?)`;

db.query(sql, [userId,payablewords, payablefigures, outstandingwords, outstandingfigures, accountname, accountnumber, branch], (err, result) => {
if (err) {
console.error('Error inserting data: ', err);
res.status(500).send('Server error');
} else {
res.send('Data inserted successfully');
}
});
});


app.post('/api/family-details', (req, res) => {
const { userId, family_status,disability,parentname,relationship,contact,occupation,guardian_children,working_siblings,studying_siblings,monthly_income} = req.body;
const sql = `INSERT INTO family_details (user_id, family_status, disability, parent_guardian_name, relationship, contact_info, occupation, guardian_children, working_siblings, studying_siblings, monthly_income) 
VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

db.query(sql, [ userId,family_status,disability,parentname,relationship,contact,occupation,guardian_children,working_siblings,studying_siblings,monthly_income], (err, result) => {
if (err) {
console.error('Error inserting data: ', err);
res.status(500).send('Server error');
} else {
res.send('Data inserted successfully');
}
});
});



app.post('/api/disclosure-details', (req, res) => {
const { userId, bursary,bursarysource,bursaryamount,helb,granted,noreason} = req.body;
const sql = `INSERT INTO disclosure_details (user_id, receiving_bursary, bursary_source, bursary_amount, applied_helb, helb_outcome, helb_noreason) 
VALUES (?, ?, ?, ?, ?, ?, ?)`;

db.query(sql, [ userId,bursary,bursarysource,bursaryamount,helb,granted,noreason], (err, result) => {
if (err) {
console.error('Error inserting data: ', err);
res.status(500).send('Server error');
} else {
res.send('Data inserted successfully');
}
});
}); 



app.post('/api/signin', (req, res) => {
const { email, password } = req.body;

const sqlSelect = 'SELECT * FROM users WHERE email = ?';
db.query(sqlSelect, [email], (error, result) => {
if (error) {
console.log(error);
return res.status(500).json({ message: 'Server error' });
}

if (result.length === 0) {
return res.status(404).json({ message: 'User not found' });
}

const user = result[0];

// Directly compare the password from input with the database stored password
bcrypt.compare(password, user.password, (err, isMatch) => {
if (err) {
console.log(err);
return res.status(500).json({ message: 'Error comparing passwords' });
}

if (isMatch) {
// First, check if the user is a student by looking in personal_details table
const sqlGetStudent = 'SELECT * FROM personal_details WHERE email = ?';
db.query(sqlGetStudent, [user.email], (err, studentResult) => {
if (err) {
console.error('Error fetching student details:', err);
return res.status(500).send('Error fetching student data');
}

// Fetch committee details from profile_committee table if the user is a committee member
const sqlGetCommittee = 'SELECT * FROM profile_committee WHERE email = ?';
db.query(sqlGetCommittee, [user.email], (err, committeeResult) => {
if (err) {
console.error('Error fetching committee details:', err);
return res.status(500).send('Error fetching committee data');
}

// Generate JWT token
const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });

const response = {
message: 'Login successful',
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
res.status(401).json({ message: 'Invalid email or password' });
}
});
});
});



app.get('/api/admin-details', (req, res) => {
  const sql = 'SELECT name, email FROM users WHERE role = ?';
  const role = 'Admin'; // Define the role you want to query.

  db.query(sql, [role], (err, result) => {
      if (err) {
          console.error('Error fetching admin details:', err);
          return res.status(500).json({ message: 'Server error' });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: 'Admin not found' });
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

app.get('/api/student', (req, res) => {
const token = req.headers['authorization'];
if (!token) return res.status(403).send('Token is required');

jwt.verify(token, secret, (err, decoded) => {
if (err) return res.status(401).send('Unauthorized access');

const sqlGet = `
SELECT fullname, email, subcounty, ward, village, 
DATE_FORMAT(birth, '%Y-%m-%d') AS birth, 
gender, institution, year, admission, status, bursary
FROM personal_details 
WHERE email = ?
`;
db.query(sqlGet, [decoded.email], (err, students) => {
if (err) {
console.error('Error fetching data:', err);
return res.status(500).send('Error fetching data');
}
res.json(students[0]); // Only return the specific student's details
});
});
});

app.get('/api/reports', (req, res) => {
const token = req.headers['authorization'];
if (!token) return res.status(403).send('Token is required');

jwt.verify(token, secret, (err, decoded) => {
if (err) return res.status(401).send('Unauthorized access');

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
console.error('Error fetching data:', err);
return res.status(500).send('Error fetching data');
}
res.json(students[0]); // Only return the specific student's details
});
});
});

app.put('/api/student/update', (req, res) => {
const token = req.headers['authorization'];
if (!token) return res.status(403).send('Token is required');

jwt.verify(token, secret, (err, decoded) => {
if (err) return res.status(401).send('Unauthorized access');

const { fullname, email, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;

// Convert birth to 'YYYY-MM-DD' format if it exists
const formattedBirth = birth ? new Date(birth).toISOString().split('T')[0] : null;

const sqlUpdate = `
UPDATE personal_details 
SET fullname = ?, email=?, subcounty = ?, ward = ?, village = ?, birth = ?, gender = ?, institution = ?, year = ?, admission = ? 
WHERE email = ?`;

db.query(
sqlUpdate,
[fullname, email, subcounty, ward, village, formattedBirth, gender, institution, year, admission, decoded.email],
(err, result) => {
if (err) {
console.error('Error updating data:', err);
return res.status(500).send('Error updating data');
}
res.send({ message: 'Profile updated successfully', data: req.body });
}
);
});
});


// Route to get the allocated and remaining funds
app.get('/api/committee-count', (req, res) => {
const queryTotalFunds = 'SELECT amount FROM bursary_funds WHERE id = 1';
const queryAllocatedFunds = 'SELECT SUM(bursary) AS total_allocated FROM personal_details'; // Assuming an 'allocations' table that tracks allocations

db.query(queryTotalFunds, (err, totalResult) => {
if (err) {
return res.status(500).send({ error: 'Error fetching total funds' });
}

if (totalResult.length > 0) {
const totalAmount = totalResult[0].amount;

db.query(queryAllocatedFunds, (err, allocatedResult) => {
if (err) {
return res.status(500).send({ error: 'Error fetching allocated funds' });
}

const allocatedAmount = allocatedResult[0].total_allocated || 0;
const remainingAmount = totalAmount - allocatedAmount;

res.status(200).json({ amount: totalAmount, allocated: allocatedAmount, remaining: remainingAmount });
});
} else {
res.status(404).json({ error: 'No bursary fund found' });
}
});
});


// Route to get quick statistics (total, approved, rejected)
app.get('/api/quick-statistics', (req, res) => {
const queryTotal = 'SELECT COUNT(*) AS total FROM personal_details';
const queryApproved = 'SELECT COUNT(*) AS approved FROM personal_details WHERE status = "approved"';
const queryRejected = 'SELECT COUNT(*) AS rejected FROM personal_details WHERE status = "rejected"';

db.query(queryTotal, (err, totalResult) => {
if (err) {
return res.status(500).send({ error: 'Error fetching total applications' });
}

const totalApplications = totalResult[0].total;

db.query(queryApproved, (err, approvedResult) => {
if (err) {
return res.status(500).send({ error: 'Error fetching approved applications' });
}

const approvedApplications = approvedResult[0].approved;

db.query(queryRejected, (err, rejectedResult) => {
if (err) {
return res.status(500).send({ error: 'Error fetching rejected applications' });
}

const rejectedApplications = rejectedResult[0].rejected;

res.status(200).json({ total: totalApplications, approved: approvedApplications, rejected: rejectedApplications });
});
});
});
});

app.get("/api/personalInformation", (req, res) => {
const sqlGet = "SELECT * FROM personal_details";
db.query(sqlGet, (error, result) => {
res.send(result);
});
});

app.get("/api/personalInformation/:id", (req, res) => {
const userId = req.params.id; // Get the user ID from the request parameters
console.log(userId)
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

app.get("/api/amountInformation/:id", (req, res) => {
const userId = req.params.id; // Get the user ID from the request parameters
console.log(userId)
const sqlGet = `
SELECT 
ad.*, pd.fullname, pd.admission, pd.institution 
FROM 
amount_details ad
JOIN 
personal_details pd 
ON 
ad.user_id = pd.user_id
WHERE pd.user_id = ?
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
`; // Join family_details with personal_details using the admission number
db.query(sqlGet, [userId],  (error, result) => {
if (error) {
console.error("Error fetching family and personal details:", error);
res.status(500).send("Error fetching data");
} else {
res.send(result); // Send the result of the joined tables
}
});
});

// Setup multer for file upload
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, 'uploads/');
},
filename: (req, file, cb) => {
cb(null, Date.now() + '-' + file.originalname); // unique file name
},
});

const upload = multer({ storage: storage });

// API endpoint to handle file uploads
app.post('/api/upload', upload.single('document'), (req, res) => {
const { documentName } = req.body;
const document = req.file;

// Insert into the database
const query = `INSERT INTO uploaded_document (document_name, file_path) VALUES (?, ?)`;
db.query(query, [documentName, document.path], (err, result) => {
if (err) {
console.error('Error saving to database:', err);
return res.status(500).send('Database error');
}
res.status(200).send('File uploaded and saved to database successfully');
});
});

app.get("/api/get-document/:id", (req, res) => {
const userId = req.params.id; // Get the user ID from the request parameters
console.log(userId)
const sqlGet = `
SELECT 
ud.*, pd.fullname, pd.admission, pd.institution 
FROM 
uploaded_document ud
JOIN 
personal_details pd 
ON 
ud.user_id = pd.user_id
WHERE pd.user_id = ?
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
  
// Update user status (Approve/Reject) in the personal_details table
app.put('/api/update-status/:id', (req, res) => {
const userId = req.params.id;
const { status } = req.body; // The status is sent from the frontend (Approve or Reject)
  
const query = 'UPDATE personal_details SET status = ? WHERE user_id = ?';
db.query(query, [status, userId], (error, results) => {
if (error) {
return res.status(500).json({ error: 'Error updating status' });
}
res.json({ message: `Status updated to ${status}` });
});
});

app.get("/api/get-bursary/:id", (req, res) => {
const userId = req.params.id; // Get the user ID from the request parameters
console.log(userId)
const sqlGet = `
SELECT 
ud.*, pd.fullname, pd.admission, pd.institution 
FROM 
uploaded_document ud
JOIN 
personal_details pd 
ON 
ud.user_id = pd.user_id
WHERE pd.user_id = ?
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
    
app.get("/api/get-bursary", (req, res) => {
const sqlGetAll = `
SELECT 
ud.*, pd.fullname, pd.admission, pd.institution 
FROM 
uploaded_document ud
JOIN 
personal_details pd 
ON 
ud.user_id = pd.user_id
`; // Fetch all amount details and join with personal details
            
db.query(sqlGetAll, (error, result) => {
if (error) {
console.error("Error fetching amount details:", error);
res.status(500).send("Error fetching data");
} else {
res.send(result); // Send the result of the joined tables
}
});
});
  
  
// Update user status and allocation date with both date and time in the personal_details table
app.put('/api/update-bursary/:id', (req, res) => {
  const userId = req.params.id;
  const { bursary } = req.body; // The amount allocated is sent from the frontend

  // Update both bursary and allocation_date with time
  const query = `
      UPDATE personal_details 
      SET bursary = ?, allocation_date = CURRENT_TIMESTAMP 
      WHERE user_id = ?`;

  db.query(query, [bursary, userId], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Error updating bursary and date' });
      }
      res.json({ 
          message: `Allocated Ksh ${bursary} on ${new Date().toISOString()}` 
      });
  });
});

//Administrator backend codes
// GET all users
app.get('/api/users', (req, res) => {
const query = 'SELECT * FROM users';
db.query(query, (err, results) => {
if (err) {
return res.status(500).send(err);
}
res.json(results);
});
});

// POST add a new user
app.post('/api/users', (req, res) => {
const { fullname, email, password, role } = req.body;

if (!fullname || !email || !password || !role) {
return res.status(400).json({ message: 'All fields are required' });
}
  
const saltRounds = 10; // You can adjust the cost factor (10 is recommended)
bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
if (err) {
console.log(err);
return res.status(500).json({ message: 'Error hashing password' });
}
const query = 'INSERT INTO users (name, email,password,role) VALUES (?, ?, ?, ?)';
db.query(query, [fullname, email,hashedPassword, role], (err, result) => {
if (err) {
return res.status(500).send(err);
}

// Insert into activity logs
const logQuery = 'INSERT INTO activity_log (log_message) VALUES (?)';
db.query(logQuery, [`Added new user ${fullname}`]);
res.status(201).json({ message: 'User added', userId: result.insertId });
});
});
});

app.delete('/api/users/:id', (req, res) => {
const userId = req.params.id;

// First, get the user's full name before deleting them
const selectQuery = 'SELECT name FROM users WHERE id = ?';
db.query(selectQuery, [userId], (err, result) => {
if (err || result.length === 0) {
return res.status(500).json({ message: 'Error fetching user or user not found' });
}

const userFullName = result[0].name;

// Proceed with deleting the user
const deleteQuery = 'DELETE FROM users WHERE id = ?';
db.query(deleteQuery, [userId], (err, result) => {
if (err) {
return res.status(500).send(err);
}

// Insert the user's name into the activity log after deletion
const logQuery = 'INSERT INTO activity_log (log_message) VALUES (?)';
db.query(logQuery, [`Deleted user ${userFullName}`], (logErr) => {
if (logErr) {
return res.status(500).json({ message: 'Error logging activity' });
}

res.status(200).json({ message: 'User deleted' });
});
});
});
});

// GET all activity logs
app.get('/api/activity-logs', (req, res) => {
const query = 'SELECT * FROM activity_log';
db.query(query, (err, results) => {
if (err) {
return res.status(500).send(err);
}
res.json(results);
});
});


app.post('/api/bursary-funds', (req, res) => {
const { amount } = req.body;

if (!amount || isNaN(amount)) {
return res.status(400).json({ message: 'Invalid amount provided' });
}

const query = 'INSERT INTO bursary_funds (amount) VALUES (?)';
db.query(query, [amount], (err, result) => {
if (err) {
console.error('Error inserting data:', err);
return res.status(500).json({ message: 'Server error' });
}
res.status(200).json({ message: 'Funds disbursed successfully' });
});
});

// Update bursary fund allocation
app.put('/api/adjust-funds', (req, res) => {
const { amount } = req.body;
const id = 1; // Assuming there's only one row, you can hardcode the ID

const updateQuery = 'UPDATE bursary_funds SET amount = ? WHERE id = ?';

db.query(updateQuery, [amount, id], (err, result) => {
if (err) {
return res.status(500).send(err);
}
res.status(200).json({ message: 'Fund allocation adjusted successfully!' });
});
});


// API to fetch user report by ID
app.get('/api/user-report/:id', (req, res) => {
const query = `
SELECT fullname, admission_number AS admission, institution, status, 
bursary AS amountAllocated
FROM personal_details 
WHERE user_id = ?;`; // Fetch user data by ID

const userId = req.params.id; // Get user ID from the URL parameter

db.query(query, [userId], (err, results) => {
if (err) {
console.error('Error fetching user data:', err.message);
return res.status(500).json({ error: 'Internal Server Error' });
}

if (results.length > 0) {
res.json(results[0]);
} else {
res.status(404).json({ error: 'User not found' });
}
});
});


app.get('/api/profile-committee', (req, res) => {
const token = req.headers['authorization']?.split(' ')[1];
if (!token) return res.status(403).send('Token is required');

jwt.verify(token, secret, (err, decoded) => {
if (err) return res.status(401).send('Unauthorized access');

const sqlGet = `
SELECT fullname, email, phone_no, national_id, subcounty, 
ward, position, 
CASE 
WHEN fullname IS NULL OR phone_no IS NULL OR national_id IS NULL THEN 0
ELSE 1
END AS is_complete
FROM profile_committee 
WHERE email = ?
`;

db.query(sqlGet, [decoded.email], (err, result) => {
if (err) {
console.error('Error fetching committee data:', err);
return res.status(500).send('Error fetching data');
}

if (result.length === 0) {
return res.status(404).send('Profile not found');
}

res.json(result[0]);
});
});
});


app.post('/api/profile-form', (req, res) => {
const token = req.headers['authorization']?.split(' ')[1];
if (!token) return res.status(403).send('Token is required');

jwt.verify(token, secret, (err, decoded) => {
if (err) return res.status(401).send('Unauthorized access');

const { fullname, phone_no, national_id, subcounty, ward, position } = req.body;

if (!fullname || !phone_no || !national_id || !subcounty || !ward || !position) {
return res.status(400).send('All profile fields are required');
}

const email = decoded.email;

const sqlInsert = `
INSERT INTO profile_committee (fullname, email, phone_no, national_id, subcounty, ward, position) 
VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.query(sqlInsert, [
fullname,
email,
phone_no,
national_id,
subcounty,
ward,
position
], (err, result) => {
if (err) {
console.error('Error inserting committee data:', err);
return res.status(500).send('Error submitting data');
}

res.status(201).send({
message: 'Profile created successfully',
data: {
fullname,
email,
phone_no,
national_id,
subcounty,
ward,
position
}
});
});
});
});

app.get('/api/comreport', (req, res) => {
const token = req.headers['authorization'];
if (!token) return res.status(403).send('Token is required');
  
jwt.verify(token, secret, (err, decoded) => {
if (err) return res.status(401).send('Unauthorized access');
  
const sqlGet = `
SELECT 
CONCAT('REFNO', LPAD(id, 2, '0')) AS reference_number,  -- Generate the reference number
fullname, 
email,
phone_no,
national_id,
subcounty, 
ward, 
position
FROM profile_committee 
WHERE email = ?
`;
  
db.query(sqlGet, [decoded.email], (err, result) => {
if (err) {
console.error('Error fetching data:', err);
return res.status(500).send('Error fetching data');
}
res.json(result[0]); // Only return the specific student's details
});
});
});

app.listen(5000, () => {
console.log("server is running on port 5000");
});