const jwt = require("jsonwebtoken");
const connectDB = require("./db");

module.exports = async (req, res) => {
  if (req.method !== "PUT") return res.status(405).json({ message: "Method Not Allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { fullname, subcounty, ward, village, birth, gender, institution, year, admission } = req.body;

    const formattedBirth = birth ? new Date(birth).toISOString().split("T")[0] : null;
    const db = await connectDB();

    await db.execute(
      `UPDATE personal_details 
       SET fullname = ?, subcounty = ?, ward = ?, village = ?, birth = ?, gender = ?, institution = ?, year = ?, admission = ? 
       WHERE email = ?`,
      [fullname, subcounty, ward, village, formattedBirth, gender, institution, year, admission, decoded.email]
    );

    db.end();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
