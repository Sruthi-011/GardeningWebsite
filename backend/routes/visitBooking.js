const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res) => {
  const { visit_date, time_slot } = req.body;

  if (!visit_date || !time_slot) {
    return res.status(400).json({ error: 'Please provide visit date and time slot' });
  }

  const insertQuery = `
    INSERT INTO visit_bookings (user_id, visit_date, time_slot, status)
    VALUES (?, ?, ?, 'Pending')
  `;

  db.query(insertQuery, [req.user.id, visit_date, time_slot], (err, results) => {
    if (err) {
      console.error('Error creating booking:', err);
      return res.status(500).json({ error: 'Database error while creating booking' });
    }

    res.json({ message: '✅ Visit booked successfully', bookingId: results.insertId });
  });
});

router.get('/my-bookings', protect, (req, res) => {
  const query = `
    SELECT id, visit_date, time_slot, status, created_at 
    FROM visit_bookings 
    WHERE user_id = ? 
    ORDER BY visit_date DESC
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      console.error('Error fetching user bookings:', err);
      return res.status(500).json({ error: 'Database error while fetching bookings' });
    }
    res.json(results);
  });
});

module.exports = router;
