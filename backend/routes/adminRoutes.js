const express = require("express");
const router = express.Router();
const { getAllVisits, updateVisitStatus } = require("../controllers/adminVisitController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/visits", protect, isAdmin, getAllVisits);
router.put("/visits/:id/status", protect, isAdmin, updateVisitStatus);

module.exports = router;
