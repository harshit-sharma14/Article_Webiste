const jwt = require("jsonwebtoken");
const User = require("./models/Users");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  next();
};

const isEditor = (req, res, next) => {
  if (!["editor", "admin"].includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = { verifyToken, isAdmin, isEditor };
