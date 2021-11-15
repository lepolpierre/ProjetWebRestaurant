"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const {isAuth, isConnected} = require('../middlewares/auth');



const router = express.Router();

//router.get('/:categorie', platControllers.getMenuCategorie, isConnected);
router.get('/', platControllers.getMenu2, isConnected);



module.exports = router;