"use strict";

const express = require("express");

const platController = require('../controllers/platControllers');

const router = express.Router();

const {isAuth, isConnected} = require('../middlewares/auth');


router.get('/:platId', platController.getPlat, isConnected);
module.exports = router;
