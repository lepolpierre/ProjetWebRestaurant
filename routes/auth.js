'use strict';

// Router config
const express = require('express');
const router = express.Router();

// Controller
const authCtrl = require('../controllers/authController');


router.get('/', (req,res)=>{
    res.send("auth route");
});

router.get('/signup', authCtrl.registerAccount);
router.post('/signup', authCtrl.createAccount);


// Exportation du router
module.exports = router;