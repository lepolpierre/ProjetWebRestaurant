'use strict';

// Router config
const express = require('express');
const router = express.Router();

// Controller
const authCtrl = require('../controllers/authController');


router.get('/', authCtrl.isLoggedIn,  (req,res)=>{
    res.send("auth route");
});


// Création de compte
router.get('/signup',  authCtrl.registerAccount);
router.post('/signup', authCtrl.createAccount);
// router.get('/signup/verify/:userId', );

// Connexion
router.get('/login',  authCtrl.loginForm);
router.post('/login', authCtrl.loginAccount);



// Exportation du router
module.exports = router;