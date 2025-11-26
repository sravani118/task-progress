import jwt from "jsonwebtoken";

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "Access denied. No token provided." 
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = {
      id: decoded.id,
      name: decoded.name
    };

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    return res.status(500).json({ message: "Authentication failed." });
  }
};

export default authMiddleware;
