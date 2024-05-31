const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    let message = "Forbidden";
    if (err.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (err.name === "JsonWebTokenError") {
      message = "Invalid token";
    }
    return res.status(403).json({ message });
  }
};

module.exports = { authMiddleware };
