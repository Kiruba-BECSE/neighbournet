const express = require('express');
const router = express.Router();
const { getMyTasks, startWork, completeWork } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/my-tasks', protect, authorize('worker'), getMyTasks);
router.put('/:id/start', protect, authorize('worker'), startWork);
router.put('/:id/complete', protect, authorize('worker'), upload.single('afterImage'), completeWork);

module.exports = router;