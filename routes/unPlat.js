"use strict";

const express = require("express");

const platController = require('../controllers/platControllers');

const router = express.Router();

// router.get('/', (req,res)=>{
//     res.end('routes plat');
// });
router.get('/:platId', platController.getPlat);

module.exports = router;
