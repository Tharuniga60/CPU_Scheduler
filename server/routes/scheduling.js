const express = require('express');
const router = express.Router();
const { calculate, compare } = require('../controllers/schedulingController');
const auth = require('../middleware/authMiddleware');

router.post('/calculate', auth, calculate);
router.post('/compare', auth, compare);

module.exports = router;
