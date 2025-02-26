const jwt = require("jsonwebtoken");
const connectDB = require("../db");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await connectDB();

    const [students] = await db.execute(
      `SELECT fullname, email, subcounty, ward, village, 
      DATE_FORMAT(birth, '%Y-%m-%d') AS birth, 
      gender, institution, year, admission, status, bursary
      FROM personal_details WHERE email = ?`, 
      [decoded.email]
    );

    db.end();
    if (students.length === 0) return res.status(404).json({ message: "Student not found" });

    res.json(students[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error" });
  }
};
