const express = require('express');
const router = express.Router();

const authRoute = require('./authRoute');
const chatDashboardRoute = require('./chatDashboardRoute');
const {indexPage} = require('../controllers/indexController')

router.get('/', indexPage)

router.use('/',authRoute);
router.use('/',chatDashboardRoute);

module.exports = router
