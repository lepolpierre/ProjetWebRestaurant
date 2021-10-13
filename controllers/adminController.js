'use strict';

// Importation du modèle User de la BD
const User = require('../model/user');
// Hashage du mot de passe
const bcrypt = require('bcrypt');



// Affiche le formulaire permettant de la création d'un compte utilisateur
exports.registerAccount = (req, res) => {
    res.render('registerForm', {
        pageTitle: "Création de compte"
    });
};


// Permet la création du compte utilisateur
exports.createAccount = (req, res) => {
    const { u_email, u_username, u_pwd, u_pwdConfirm } = req.body;

    // Verifier que tous les champs ont été fournis
    if (!u_email || !u_username || !u_pwd || !u_pwdConfirm) {
        res.status(500);
        return returnUserFormRempli(req, res, "Veuillez remplir tous les champs! ");
    }

    // let exists= User.findOne({email :  u_email});
    // if(exists){
    //    res.status(500);
    //    return returnUserFormRempli(req,res, "Courriel existant, veuillez en choisir un autre! ");
    // }


    // Verifier les deux mots de passes.
    if (!verifierDeuxMDP(u_pwd, u_pwdConfirm)) {
        res.status(500);
        return returnUserFormRempli(req, res, "Les deux mots de passes doivent être identiques! ");
    }


    const user = new User({
        email: u_email,
        username: u_username,
        password: u_pwd
    });

    // Enregistrement du nouvel utilisateur
    user.save()
        .then(() => {
            res.json({ msg: `utilisateur ${user.username} cree!` });
        })
        .catch(err => {
            console.error(err);
            returnUserFormRempli(req, res, err);
        });


};


const verifierDeuxMDP = (mdp1, mdp2) => {
    return mdp1 === mdp2;
};



/**
 * Renvoie le formulaire de création d'utilisateur avec données pré-rempli
 * @param {object} req 
 * @param {object} res 
 */
const returnUserFormRempli = (req, res, error = "") => {
    res.render('registerForm', {
        email: req.body.u_email,
        username: req.body.u_username,
        pwd: req.body.u_pwd,
        error: error
    });
};