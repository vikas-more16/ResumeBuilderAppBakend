const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;

    console.log("RAW AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
