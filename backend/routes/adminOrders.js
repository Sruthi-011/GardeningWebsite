const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET ALL ORDERS with items for admin
router.get('/', protect, isAdmin, (req, res) => {
    const query = `
        SELECT o.id as order_id, o.user_id, o.total_price, o.status, o.created_at,
               oi.id as order_item_id, oi.product_id, p.name, oi.quantity, oi.price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        const ordersMap = {};
        results.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    user_id: row.user_id,
                    total_price: row.total_price,
                    status: row.status || 'Pending',
                    created_at: row.created_at,
                    products: []
                };
            }
            if (row.order_item_id) {
                ordersMap[row.order_id].products.push({
                    product_id: row.product_id,
                    name: row.name,
                    quantity: row.quantity,
                    price: row.price
                });
            }
        });

        res.json(Object.values(ordersMap));
    });
});

// UPDATE ORDER STATUS
router.put('/:id/status', protect, isAdmin, (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: `Order status updated to ${status}` });
    });
});

module.exports = router;
