const express = require('express');
const router = express.Router();

const authRoute = require('./authRoutes');
const {indexPage} = require('../controllers/indexController')

router.get('/',indexPage)

router.use('/',authRoute);

module.exports = router