const jwt = require('jsonwebtoken');

async function authmiddleware(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please log in."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        req.user = decoded;
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' 
            ? "Session expired, please login again" 
            : "Invalid or tampered token";

        return res.status(401).json({ message });
    }
}

module.exports = authmiddleware;