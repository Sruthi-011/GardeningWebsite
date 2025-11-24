const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, async (req, res) => {
    try {
        const [cartItems] = await db.promise().query(`
            SELECT c.id AS cart_id, c.quantity, p.id AS product_id, p.name, p.price, p.stock, p.image_url
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [req.user.id]);
        res.json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});


router.post('/', protect, async (req, res) => {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ error: 'Product ID and quantity required' });

    try {
        const [existing] = await db.promise().query(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user.id, product_id]
        );

        if (existing.length > 0) {
            await db.promise().query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existing[0].id]
            );
            res.json({ message: 'Cart updated successfully' });
        } else {
            const [result] = await db.promise().query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, product_id, quantity]
            );
            res.json({ message: 'Product added to cart', cartId: result.insertId });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add/update cart' });
    }
});


router.put('/:id', protect, async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ error: 'Invalid quantity' });

    try {
        const [result] = await db.promise().query(
            'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
        res.json({ message: 'Quantity updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update quantity' });
    }
});


router.delete('/:id', protect, async (req, res) => {
    try {
        const [result] = await db.promise().query(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove item' });
    }
});


router.post('/checkout', protect, async (req, res) => {
    const { address, phone, payment_method } = req.body;

    if (!address || !phone || !payment_method) {
        return res.status(400).json({ error: "Address, phone and payment method are required" });
    }

    let connection;
    try {
        connection = await db.promise().getConnection();
        await connection.beginTransaction();

        // Get cart items
        const [cartItems] = await connection.query(`
            SELECT c.product_id, c.quantity, p.price, p.stock, p.name
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, [req.user.id]);

        if (cartItems.length === 0) throw new Error('Cart is empty');

        // Calculate total price and check stock
        let totalPrice = 0;
        for (const item of cartItems) {
            if (item.stock < item.quantity)
                throw new Error(`Not enough stock for ${item.name}`);
            totalPrice += item.quantity * item.price;
        }

        // Insert order with address, phone, payment method
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_price, address, phone, payment_method) 
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, totalPrice, address, phone, payment_method]
        );

        const orderId = orderResult.insertId;

        // Insert order items and update stock
        for (const item of cartItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
            await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // Clear cart
        await connection.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

        await connection.commit();
        connection.release();

        res.json({
            message: "Order placed successfully!",
            orderId,
            total_price: totalPrice
        });

    } catch (err) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        console.error("Checkout Error:", err.message);
        res.status(500).json({ error: err.message || "Checkout failed" });
    }
});

module.exports = router;
