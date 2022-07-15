const express = require('express');
const rateLimit = require('express-rate-limit')
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordValidator = require ('../middleware/password')

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/signup', limiter, passwordValidator, userCtrl.signup);

router.post('/login', userCtrl.login);

module.exports = router;