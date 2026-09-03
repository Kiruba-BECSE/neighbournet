const express = require('express');
const router = express.Router();
const { getAllIncidents, getIncidentById } = require('../controllers/incidentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('officer', 'admin'), getAllIncidents);
router.get('/:id', protect, getIncidentById);

module.exports = router;