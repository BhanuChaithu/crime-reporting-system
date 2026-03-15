const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById, updateReport, getPoliceStats } = require('../controllers/crimeController');
const { protect, policeOnly, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('evidence'), createReport);
router.get('/', protect, getReports);
router.get('/stats', protect, policeOnly, getPoliceStats);
router.get('/:id', protect, getReportById); // View details
router.put('/:id', protect, updateReport); // Police/Admin update

module.exports = router;
