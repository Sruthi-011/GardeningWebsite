const db = require('../config/db');

// Add a new review
const addReview = (req, res) => {
    const userId = req.user.id;
    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
    db.query(query, [product_id, userId, rating, comment], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'Review added successfully' });
    });
};

// Get all reviews for a specific product
const getProductReviews = (req, res) => {
    const productId = req.params.productId;

    const query = `
        SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ?
        ORDER BY r.created_at DESC
    `;

    db.query(query, [productId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
};

module.exports = {
    addReview,
    getProductReviews,
};
