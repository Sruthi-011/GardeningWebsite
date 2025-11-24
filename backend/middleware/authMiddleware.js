const jwt = require('jsonwebtoken');
const db = require('../config/db'); 

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.query('SELECT id, name, email, is_admin FROM users WHERE id = ?', [decoded.id], (err, results) => {
            if (err) {
                console.error('Database error in authMiddleware:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            if (results.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = results[0]; 
            console.log('protect middleware: req.user =', req.user); 
            next();
        });
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.is_admin === 1) { 
        next();
    } else {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }
};

module.exports = { protect, isAdmin };
