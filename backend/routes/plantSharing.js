const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware'); // ✅ destructured import
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded images in the uploads/ folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename with original extension
    }
});

const upload = multer({ storage: storage });

// Add a plant to share (protected route with image upload)
router.post('/', protect, upload.single('image'), (req, res) => {
    const { plant_name, description, category, quantity } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!plant_name) {
        return res.status(400).json({ error: 'Plant name is required' });
    }

    const query = `
        INSERT INTO plant_sharing (user_id, plant_name, description, category, quantity, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [req.user.id, plant_name, description, category, quantity || 1, image_url],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Plant shared successfully', plantId: results.insertId });
        }
    );
});

// Get all shared plants (public route)
router.get('/', (req, res) => {
    const query = `
        SELECT ps.id, ps.plant_name, ps.description, ps.category, ps.quantity, ps.image_url, u.name as shared_by
        FROM plant_sharing ps
        JOIN users u ON ps.user_id = u.id
        ORDER BY ps.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

module.exports = router;
