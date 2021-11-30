"use strict";



const express = require("express");

const pageControllers = require('../controllers/newPageController');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

router.get('/create', isConnected, pageControllers.creatNewPage);
router.post('/add',pageControllers.addPage);
router.get('/:titre', isConnected, pageControllers.getNewpage);

module.exports = router;