const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET all products (Admin)
router.get('/', protect, isAdmin, (req, res) => {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ error: 'Database error while fetching products' });
        }
        res.json(results);
    });
});

// UPDATE a product
router.put('/:id', protect, isAdmin, (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category, stock, season, is_featured } = req.body;

    // Basic validation
    if (!name || price === undefined || !category || stock === undefined) {
        return res.status(400).json({ error: 'Please provide all required fields: name, price, category, stock' });
    }

    const query = `
        UPDATE products
        SET name = ?, description = ?, price = ?, category = ?, stock = ?, season = ?, is_featured = ?
        WHERE id = ?
    `;

    db.query(
        query,
        [name, description || null, price, category, stock, season || null, is_featured ? 1 : 0, productId],
        (err, results) => {
            if (err) {
                console.error('DB Error:', err);
                return res.status(500).json({ error: 'Database error while updating product' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// DELETE a product
router.delete('/:id', protect, isAdmin, (req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ error: 'Database error while deleting product' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
