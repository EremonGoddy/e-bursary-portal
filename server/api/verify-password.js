const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connectDB = require("../db");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { password } = req.query;

    const db = await connectDB();
    const [users] = await db.execute("SELECT password FROM users WHERE id = ?", [decoded.userId]);

    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, users[0].password);
    db.end();

    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Password verified" });
  } catch (error) {
    console.error("Password verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
