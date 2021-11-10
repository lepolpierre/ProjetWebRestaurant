"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const router = express.Router();

router.get('/:categorie', platControllers.getMenuCategorie);
router.get('/', platControllers.getMenu);
//router.get('/2', platControllers.getMenu2);


module.exports = router;