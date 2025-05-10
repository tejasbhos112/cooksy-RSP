// Middleware for protecting routes  
// Verifies JWT tokens and attaches user info to requests  


const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get token from request headers
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
