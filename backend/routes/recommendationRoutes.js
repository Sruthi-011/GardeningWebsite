const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getRecommendations } = require('../controllers/recommendationController');

// 🔒 Protected route: fetch user recommendations
router.get('/', protect, getRecommendations);

module.exports = router;
