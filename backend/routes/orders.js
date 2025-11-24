const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const [results] = await db.promise().query(`
            SELECT 
                o.id AS order_id, 
                o.total_price, 
                o.status, 
                o.created_at,
                o.address,
                o.phone,
                o.payment_method,
                oi.product_id, 
                p.name, 
                oi.quantity, 
                oi.price
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `, [req.user.id]);

        const ordersMap = {};

        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    total_price: row.total_price,
                    status: row.status || 'Pending',
                    created_at: row.created_at,
                    address: row.address,
                    phone: row.phone,
                    payment_method: row.payment_method,
                    products: []
                };
            }

            if (row.product_id) {
                ordersMap[row.order_id].products.push({
                    product_id: row.product_id,
                    name: row.name,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        res.json(Object.values(ordersMap));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.get('/all', protect, isAdmin, async (req, res) => {
    try {
        const [results] = await db.promise().query(`
            SELECT 
                o.id AS order_id, 
                o.user_id, 
                o.total_price, 
                o.status, 
                o.created_at,
                o.address,
                o.phone,
                o.payment_method,
                oi.product_id, 
                p.name, 
                oi.quantity, 
                oi.price
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            ORDER BY o.created_at DESC
        `);

        const ordersMap = {};

        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    total_price: row.total_price,
                    status: row.status || 'Pending',
                    created_at: row.created_at,
                    address: row.address,
                    phone: row.phone,
                    payment_method: row.payment_method,
                    products: []
                };
            }

            if (row.product_id) {
                ordersMap[row.order_id].products.push({
                    product_id: row.product_id,
                    name: row.name,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        res.json(Object.values(ordersMap));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all orders' });
    }
});

module.exports = router;
