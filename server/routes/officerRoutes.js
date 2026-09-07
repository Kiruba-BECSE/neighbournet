const express = require('express');
const router = express.Router();
const { getDashboard, assignWorker, verifyGrievance } = require('../controllers/officerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('officer'), getDashboard);
router.put('/:id/assign', protect, authorize('officer'), assignWorker);
router.put('/:id/verify', protect, authorize('officer'), verifyGrievance);

module.exports = router;