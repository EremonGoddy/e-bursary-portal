const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("./db");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  const { email, password } = req.body;
  const db = await connectDB();

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Get student or committee details
    const [student] = await db.execute("SELECT * FROM personal_details WHERE email = ?", [email]);
    const [committee] = await db.execute("SELECT * FROM profile_committee WHERE email = ?", [email]);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      student: student[0] || null,
      committee: committee[0] || null,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    db.end();
  }
};
