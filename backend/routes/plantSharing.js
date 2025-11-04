const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

/* -------------------------------------------------------------------------- */
/* 🌿 MULTER SETUP */
/* -------------------------------------------------------------------------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/* -------------------------------------------------------------------------- */
/* 🪴 POST: Share a new plant (Protected Route) */
/* -------------------------------------------------------------------------- */
router.post('/', protect, upload.single('image'), (req, res) => {
  const { plant_name, description, category, quantity, location, phone_number } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!plant_name) {
    return res.status(400).json({ error: 'Plant name is required' });
  }

  const query = `
    INSERT INTO plant_sharing 
    (user_id, plant_name, description, category, quantity, image_url, location, phone_number, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')
  `;

  db.query(
    query,
    [
      req.user.id,
      plant_name,
      description || '',
      category || '',
      quantity || 1,
      image_url,
      location || '',
      phone_number || null,
    ],
    (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ error: 'Database error while sharing plant' });
      }
      res.json({
        message: '🌿 Plant shared successfully!',
        plantId: results.insertId,
      });
    }
  );
});

/* -------------------------------------------------------------------------- */
/* 🌱 GET: Fetch all shared plants */
/* -------------------------------------------------------------------------- */
router.get('/', (req, res) => {
  const query = `
    SELECT 
      ps.id, 
      ps.plant_name, 
      ps.description, 
      ps.category, 
      ps.quantity, 
      ps.image_url, 
      ps.location,
      ps.phone_number,
      ps.status,
      ps.created_at,
      ps.updated_at,
      u.name AS shared_by,
      u.email AS shared_email
    FROM plant_sharing ps
    JOIN users u ON ps.user_id = u.id
    ORDER BY ps.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'Database error while fetching plants' });
    }

    // ✅ Handle missing phone number
    const formattedResults = results.map((plant) => ({
      ...plant,
      phone_number: plant.phone_number || 'Not specified',
    }));

    res.json(formattedResults);
  });
});

/* -------------------------------------------------------------------------- */
/* 🔄 PUT: Update plant status (Protected Route) */
/* -------------------------------------------------------------------------- */
router.put('/:id/status', protect, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!status) {
    return res.status(400).json({ error: 'Status value is required' });
  }

  const findPlantQuery = 'SELECT * FROM plant_sharing WHERE id = ?';
  db.query(findPlantQuery, [id], (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return res.status(500).json({ error: 'Database error while verifying plant' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    const plant = results[0];
    if (plant.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized — you can only update your own shared plants' });
    }

    const updateQuery = 'UPDATE plant_sharing SET status = ?, updated_at = NOW() WHERE id = ?';
    db.query(updateQuery, [status, id], (err2) => {
      if (err2) {
        console.error('Database Error:', err2);
        return res.status(500).json({ error: 'Database error while updating status' });
      }
      res.json({ message: '✅ Status updated successfully', newStatus: status });
    });
  });
});

module.exports = router;
