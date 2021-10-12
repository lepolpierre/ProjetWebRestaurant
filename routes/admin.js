'use strict';

// Router config
const express = require('express');
const router = express.Router();

// Controller
const adminCtrl = require('../controllers/adminController');


router.get('/', (req,res)=>{
    res.send("admin route");
});

router.get('/create', adminCtrl.registerAccount);
router.post('/create', adminCtrl.createAccount);


// Exportation du router
module.exports = router;