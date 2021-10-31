'use strict';

// Router config
const express = require('express');
const router = express.Router();

// Controller
const authCtrl = require('../controllers/authController');

// Middlewares
const {isAuth} = require('../middlewares/isAuth');


router.get('/',  (req,res)=>{
    res.send("auth route");
});


// Création de compte
router.get('/signup',  authCtrl.registerAccount);               // GET signup form  
router.post('/signup', authCtrl.createAccount);                 // POST singnup form
router.get('/signup/verify/:userId', authCtrl.emailValidation); // GET verify user


// Connexion
router.get('/login',  authCtrl.loginForm);                      // GET login form
router.post('/login', authCtrl.loginAccount);                   // POST login form

router.get('/login/sendrecover', authCtrl.getRecover);         // GET send recover pwd
router.post('/login/sendrecover', authCtrl.sendRecover);       // POST send recover pwd

router.get('/login/recover/:userId', authCtrl.recoverForm);            // GET recover pwd
router.post('/login/recover');                                 // POST recover pwd



// Exportation du router
module.exports = router;