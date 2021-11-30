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
            if(!err || user){

                // Enregistrement du token si l'utilisateur est autorisé (niveau 1)
                if(user.level === 1){
                    req.user = user;
                    // continuer si autorisé
                    console.log(req.user);
                    next();
                    return;
                }
              
            }
            
            // Supprimer le token en cas d'erreurs.
            LocalS.removeItem('token');
        

        });

    }

    // S'il n'est pas autorisé, renvoyer la page de connexion
    return res.status(401).render("auth/login", {
        user: req.user,
        pageTitle: "Connexion",
        msg: "Une connexion est requise !"
      });
};


/**
 * Permet de déterminer si un utilisateur quelconque est connecté
 * @param {objet} req 
 * @param {objet} res 
 * @param {function} next 
 */
exports.isConnected = (req,res,next)=> {
    const token = LocalS.getItem('token');
    
    if(token !== null){
        console.log(`[Connected token] : ${token}`);

        // Récupérer les données du token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
            if(err || !user){
                // Supprimer le token en cas d'erreurs.
                LocalS.removeItem('token');
                return;
            }
            
            // Enregistrement du token.
            req.user = user;

        });

    }

    next();
};