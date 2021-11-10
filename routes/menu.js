"use strict";

const express = require("express");


const platControllers = require('../controllers/platControllers');

const router = express.Router();

router.get('/:categorie', platControllers.getMenuCategorie);
router.get('/', platControllers.getMenu);



module.exports = router;