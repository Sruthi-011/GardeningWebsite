const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addReview, getProductReviews } = require('../controllers/reviewController');

router.post('/', protect, addReview);

router.get('/:productId', getProductReviews);

module.exports = router;
