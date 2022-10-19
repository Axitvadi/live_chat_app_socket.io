const express = require('express');
const router = express.Router();

const authRoute = require('./authRoutes');
const chatDashboardRoute = require('./chatDashboardRoute');
const {indexPage} = require('../controllers/indexController')

router.get('/',indexPage)

router.use('/',authRoute);
router.use('/',chatDashboardRoute);

module.exports = router