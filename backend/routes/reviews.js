const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Destructure protect
const { addReview, getProductReviews } = require('../controllers/reviewController');

// Add a review (protected route)
router.post('/', protect, addReview);

// Get reviews for a specific product (public route)
router.get('/:productId', getProductReviews);

module.exports = router;
