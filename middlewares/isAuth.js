"use strict";

const jwt = require('jsonwebtoken'); // JWT


// LocalStorage
var LocalS = require('node-localstorage').LocalStorage;
LocalS = new LocalS('./localStorage');




/**
 * Permet de vérifier l'authentification de l'utilisateur.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.isAuth = (req,res,next)=>{
    const token = LocalS.getItem('token');
    
    if(token !== null){
        console.log(`[isAuth token] : ${token}`);

        // Récupérer les données du token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
            if(err || !user){
                // Supprimer le token en cas d'erreurs.
                LocalS.removeItem('token');
                return res.status(401).json({err:err});
            }
            
            // Enregistrement du token.
            req.user = user;

        });

    }

    next();

    // Diriger l'utilisateur à se connecter.
    // res.status(301).render('login');



};