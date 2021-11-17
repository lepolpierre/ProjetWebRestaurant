"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

//router.get('/:categorie', platControllers.getMenuCategorie, isConnected);
router.get('/', isConnected, platControllers.getMenu2);



module.exports = router;