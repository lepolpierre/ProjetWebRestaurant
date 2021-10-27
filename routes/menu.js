"use strict";

const express = require("express");

const paginate = require("express-paginate");

const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getMenu);
router.use(paginate.middleware(10, 50));

module.exports = router;