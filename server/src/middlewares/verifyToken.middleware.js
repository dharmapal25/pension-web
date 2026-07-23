const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies?.authToken;

    if (!token) return res.status(401).json({
        message: "Authentication token is required"
    });

    try {

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
        
    } catch {
        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = verifyToken;
