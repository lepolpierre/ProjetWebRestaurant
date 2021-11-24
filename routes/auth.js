'use strict';

// Router config
const express = require('express');
const router = express.Router();

// Controller
const authCtrl = require('../controllers/authController');

// Middlewares
const {isAuth, isConnected} = require('../middlewares/auth');


router.get('/',  (req,res,next)=>{
    res.send("auth route");
});


// Création de compte
router.get('/signup', isConnected,  authCtrl.registerUser);         // GET signup form  
router.post('/signup', authCtrl.signupUser);                        // POST singnup form
router.get('/signup/verify/:userId', authCtrl.verifyUserEmail);     // GET verify user


// Connexion
router.get('/login', isConnected, authCtrl.loginUser);                   // GET login form
router.post('/login', authCtrl.login);                              // POST login form

router.get('/login/sendrecover', authCtrl.getRecoverUserEmail);     // GET send recover pwd
router.post('/login/sendrecover', authCtrl.sendRecoverEmail);       // POST send recover pwd

router.get('/login/recover/:userId', authCtrl.recoverUser);         // GET recover pwd
router.post('/login/recover', authCtrl.userPwdUpdate);              // POST recover pwd

router.get('/login/disconnect/:userId', authCtrl.disconnect);       // GET disconnect



// Exportation du router
module.exports = router;