"use strict";

const express = require("express");

const platController = require('../controllers/platControllers')

const router = express.Router();

router.get('/', platController.getPlat);
//router.get('/plat/:platId'. platController.getPlat);

module.exports = router;
