"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const router = express.Router();

router.get('/', platControllers.getMenu);
router.get('/vege', platControllers.getMenuVege);

module.exports = router;