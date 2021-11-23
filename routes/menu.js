"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

router.get('/', isConnected, platControllers.getMenu2);

router.get('/:platId', isConnected, platControllers.getPlat);


router.get('/plat/add', isAuth, platControllers.addPlat);   // Ajout de plat


module.exports = router;