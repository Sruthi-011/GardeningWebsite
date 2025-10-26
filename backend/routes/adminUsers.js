const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET all users (Admin)
router.get('/', protect, isAdmin, (req, res) => {
    const query = 'SELECT id, name, email, role, created_at, is_admin, is_blocked FROM users ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB Error fetching users:', err);
            return res.status(500).json({ error: 'Database error while fetching users' });
        }
        res.json(results);
    });
});

// BLOCK a user
router.put('/block/:id', protect, isAdmin, (req, res) => {
    const userId = req.params.id;
    const query = 'UPDATE users SET is_blocked = 1 WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('DB Error blocking user:', err);
            return res.status(500).json({ error: 'Database error while blocking user' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User blocked successfully' });
    });
});

// UNBLOCK a user
router.put('/unblock/:id', protect, isAdmin, (req, res) => {
    const userId = req.params.id;
    const query = 'UPDATE users SET is_blocked = 0 WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('DB Error unblocking user:', err);
            return res.status(500).json({ error: 'Database error while unblocking user' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User unblocked successfully' });
    });
});

module.exports = router;
