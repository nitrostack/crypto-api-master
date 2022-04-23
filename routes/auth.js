const express = require('express');
const { signup, signin, activeStatus } = require('../controllers/auth');
const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/active-status/:id', activeStatus)

module.exports = router;