const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authMiddleware');

// Get all products with optional season filter
router.get('/', (req, res) => {
    const { season } = req.query; // Query param: ?season=Summer
    let query = `
        SELECT id, name, description, price, image_url, category, stock, created_at, season, is_featured
        FROM products
    `;
    const params = [];

    if (season) {
        query += ' WHERE season = ?';
        params.push(season);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Get products by category with optional season filter
router.get('/category/:category', (req, res) => {
    const category = req.params.category;
    const { season } = req.query; // Optional: ?season=Summer
    let query = 'SELECT * FROM products WHERE category = ?';
    const params = [category];

    if (season) {
        query += ' AND season = ?';
        params.push(season);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Get products by season
router.get('/season/:season', (req, res) => {
    const season = req.params.season;
    const query = 'SELECT * FROM products WHERE season = ?';
    db.query(query, [season], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Get featured products with optional season filter
router.get('/featured', (req, res) => {
    const { season } = req.query; // Optional: ?season=Summer
    let query = 'SELECT * FROM products WHERE is_featured = 1';
    const params = [];

    if (season) {
        query += ' AND season = ?';
        params.push(season);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Add a new product (protected route)
router.post('/', protect, (req, res) => {
    const { name, description, price, image_url, category, stock, season, is_featured } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Please provide name and price' });
    }

    const query = `
        INSERT INTO products (name, description, price, image_url, category, stock, season, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, description, price, image_url, category, stock, season || null, is_featured || 0], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Product added successfully', productId: results.insertId });
    });
});

module.exports = router;
