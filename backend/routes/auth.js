console.log('Auth routes loaded');

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
    console.log('POST /register called');
    const { name, email, password, is_admin } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length > 0) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, is_admin ? 1 : 0],
            (err, results) => {
                if (err) return res.status(500).json({ error: 'Database error' });

                const token = jwt.sign(
                    { id: results.insertId, is_admin: is_admin ? 1 : 0 },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.json({ message: 'User registered successfully', token });
            }
        );
    });
});

// User login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

        const user = results[0];

        // Blocked user check
        if (user.is_blocked === 1) {
            return res.status(403).json({ error: 'Your account is blocked. Contact admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        // Create JWT token with admin info
        const token = jwt.sign(
            { id: user.id, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token, is_admin: user.is_admin });
    });
});

// Get logged-in user's profile
router.get('/profile', protect, (req, res) => {
    const query = 'SELECT id, name, email, role, is_admin, created_at, is_blocked FROM users WHERE id = ?';
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(results[0]);
    });
});

// Admin-only route: Get all users
router.get('/admin/users', protect, isAdmin, (req, res) => {
    db.query(
        'SELECT id, name, email, role, is_admin, created_at, is_blocked FROM users ORDER BY created_at DESC',
        (err, results) => {
            if (err) {
                console.error('DB Error fetching users:', err);
                return res.status(500).json({ error: 'Database error while fetching users' });
            }
            res.json(results);
        }
    );
});

module.exports = router;
