const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const normalizeCategory = (cat) => {
    if (!cat) return '';
    const lower = cat.toLowerCase();
    if (lower.includes('plant')) return 'Plant';
    if (lower.includes('gadget') || lower.includes('tool')) return 'Garden Gadget';
    if (lower.includes('flower')) return 'Flower';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
};

router.get('/', (req, res) => {
    const { type, filter, season } = req.query;
    const params = [];
    let query = `
        SELECT id, name, description, price, image_url, category, stock, created_at, season, is_featured
        FROM products
    `;

    const conditions = [];

    if (type === 'gadgets') {
        conditions.push('category = ?');
        params.push('Garden Gadget');
    } else if (type === 'plants') {
        if (filter === 'featured') {
            conditions.push('(category = ? OR category = ?)');
            params.push('Plant', 'Flower');
            conditions.push('is_featured = 1');
        } else if (filter === 'Plant' || filter === 'Flower') {
            conditions.push('category = ?');
            params.push(filter);
        } else {
            conditions.push('(category = ? OR category = ?)');
            params.push('Plant', 'Flower');
        }
    } else {
        return res.json([]);
    }

    if (season) {
        conditions.push('season = ?');
        params.push(season);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

router.post('/', protect, isAdmin, (req, res) => {
    const { name, description, price, image_url, category, stock, season, is_featured } = req.body;

    if (!name || !price || !category) {
        return res.status(400).json({ error: 'Please provide name, price, and category' });
    }

    const normalizedCategory = normalizeCategory(category);

    const query = `
        INSERT INTO products (name, description, price, image_url, category, stock, season, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, description, price, image_url, normalizedCategory, stock, season || null, is_featured || 0],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Product added successfully', productId: results.insertId });
        }
    );
});

router.put('/:id', protect, isAdmin, (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category, stock, season, is_featured } = req.body;

    const normalizedCategory = normalizeCategory(category);

    const query = `
        UPDATE products
        SET name = ?, description = ?, price = ?, image_url = ?, category = ?, stock = ?, season = ?, is_featured = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [name, description, price, image_url, normalizedCategory, stock, season, is_featured, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated successfully' });
        }
    );
});

router.delete('/:id', protect, isAdmin, (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM products WHERE id = ?`;

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
