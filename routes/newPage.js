"use strict";



const express = require("express");

const pageControllers = require('../controllers/newPageController');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

router.get('/create', isConnected, pageControllers.creatNewPage);
router.get('/newPage/:title', isConnected, pageControllers.getNewpage);

module.exports = router;