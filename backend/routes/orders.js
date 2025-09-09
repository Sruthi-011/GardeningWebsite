const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authMiddleware');

// Create a new order
router.post('/', protect, (req, res) => {
    const { total_price } = req.body;

    if (!total_price) {
        return res.status(400).json({ error: 'Please provide total price' });
    }

    const query = 'INSERT INTO orders (user_id, total_price) VALUES (?, ?)';
    db.query(query, [req.user.id, total_price], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Order placed successfully', orderId: results.insertId });
    });
});

// Get all orders of logged-in user
router.get('/', protect, (req, res) => {
    const query = 'SELECT * FROM orders WHERE user_id = ?';
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

module.exports = router;
