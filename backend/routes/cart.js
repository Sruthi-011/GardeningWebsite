const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authMiddleware');

// Get all cart items for logged-in user
router.get('/', protect, (req, res) => {
    const query = `
        SELECT c.id as cart_id, p.id as product_id, p.name, p.price, p.image_url, c.quantity
        FROM cart_items c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// Add a product to cart
router.post('/', protect, (req, res) => {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ error: 'Product ID and quantity required' });

    // Check if product already in cart
    db.query('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, product_id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length > 0) {
            // Update quantity if already in cart
            const newQuantity = results[0].quantity + quantity;
            db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQuantity, results[0].id], (err) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ message: 'Cart updated successfully' });
            });
        } else {
            // Insert new cart item
            db.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)', 
                [req.user.id, product_id, quantity], 
                (err, results) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.json({ message: 'Product added to cart', cartId: results.insertId });
                }
            );
        }
    });
});

// Update quantity of a cart item
router.put('/:id', protect, (req, res) => {
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });

    db.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', 
        [quantity, cartId, req.user.id], 
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
            res.json({ message: 'Quantity updated successfully' });
        }
    );
});

// Remove an item from cart
router.delete('/:id', protect, (req, res) => {
    const cartId = req.params.id;
    db.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartId, req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
        res.json({ message: 'Cart item removed successfully' });
    });
});

module.exports = router;
