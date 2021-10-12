'use strict';

// Importation du modèle User de la BD
const User = require('../model/user');
// Hashage du mot de passe
const bcrypt = require('bcrypt');



// Affiche le formulaire permettant de la création d'un compte utilisateur
exports.registerAccount= (req,res)=>{
    res.render('registerForm', {
        pageTitle: "Création de compte"
    });
};


// Permet la création du compte utilisateur
exports.createAccount = (req,res)=>{
    const {u_email, u_username, u_pwd, u_pwdConfirm } = req.body;
    
    // if (!u_email || !u_username || !u_pwd || !u_pwdConfirm){
    //     return res.status(400).render(
    //         'registerForm'
    //     ); 
    // }

    const user = new User({
        email:u_email,
        username: u_username,
        password: u_pwd
    });
    
    user.save()
    .then(res => {
        console.log(res);

    });

    // erreur
    // res.render('registerForm', {
    //     email : req.body.u_email,
    //     username : req.body.u_username,
    //     pwd : req.body.u_pwd
    // });
};


const verifierDeuxMDP = (mdp1, mdp2)=>{
    return mdp1 === mdp2;
};


const saveUser = (email, username, mdp1, mdp2)=> {

   

};