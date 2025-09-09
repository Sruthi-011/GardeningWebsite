const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authMiddleware');

// Create a new visit booking
router.post('/', protect, (req, res) => {
    const { visit_date, time_slot } = req.body;

    if (!visit_date || !time_slot) {
        return res.status(400).json({ error: 'Please provide visit date and time slot' });
    }

    const query = 'INSERT INTO visit_bookings (user_id, visit_date, time_slot) VALUES (?, ?, ?)';
    db.query(query, [req.user.id, visit_date, time_slot], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Visit booked successfully', bookingId: results.insertId });
    });
});

// Get all bookings of logged-in user
router.get('/', protect, (req, res) => {
    const query = 'SELECT * FROM visit_bookings WHERE user_id = ?';
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

module.exports = router;
