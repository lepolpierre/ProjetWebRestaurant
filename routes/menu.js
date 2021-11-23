"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

router.get('/', isConnected, platControllers.getMenu2);
router.get('/json/', platControllers.getJson);
router.get('/plat/:platId', isConnected, platControllers.getPlat);



module.exports = router;