const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getMyGrievances,
  getGrievanceById,
  getAllGrievances,
  getNearbyGrievances,
  getMapData
} = require('../controllers/grievanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('citizen'), createGrievance);
router.get('/my', protect, authorize('citizen'), getMyGrievances);
router.get('/nearby', protect, getNearbyGrievances);
router.get('/map', protect, getMapData);
router.get('/', protect, authorize('officer', 'admin'), getAllGrievances);
router.get('/:id', protect, getGrievanceById);

module.exports = router;