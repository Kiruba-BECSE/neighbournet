const express = require('express');
const router = express.Router();
const { getWardOverview, getPendingApprovals, approveGrievance } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/overview', protect, authorize('admin'), getWardOverview);
router.get('/pending-approvals', protect, authorize('admin'), getPendingApprovals);
router.put('/:id/approve', protect, authorize('admin'), approveGrievance);

module.exports = router;