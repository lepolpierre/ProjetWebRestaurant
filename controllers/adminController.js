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

    // Verifier que l'utilisateur désirant s'inscrire n'existe pas.
    User.findOne({ $or:[{email :  u_email}, {username: u_username}]},(err, user)=>{
        if (err) {
            console.error(err);
            throw err;
        }

        if(user) return returnUserFormRempli(req,res, "Utilisateur existant avec ce nom d'utilisateur ou courriel");

        // Verifier les deux mots de passes.
        if (!verifierDeuxMDP(u_pwd, u_pwdConfirm)) {
            res.status(500);
            return returnUserFormRempli(req, res, "Les deux mots de passes doivent être identiques! ");
        }

        // Gener le salt et enregistrement de données.
        bcrypt.genSalt(10, (err, salt)=>{
            if (err) {
                console.error(err);
                throw err;
            }

            // Hashage du mot de passe.
            var user;
            bcrypt.hash(u_pwd, salt).then( hash =>{
                // creation d'un nouvel utilisateur.
                user = new User({
                    email: u_email,
                    username: u_username,
                    password: hash,
                    salt:salt
                });

                // Enregitrement des données dans la BD.
                user.save()
                .then(() => {
                    res.json({ msg: `utilisateur ${user.username} crée!` });
                })
                .catch(err => {
                    console.error(err);
                    returnUserFormRempli(req, res, err.errors);
                });
                         
            })
            .catch(err=>{
                throw err;
            });
            

        });


    });


};


/**
 * Permet de vérifier si les deux mots de passes concordent.
 * @param {String} mdp1 
 * @param {String} mdp2 
 * @returns True ou False
 */
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
        pageTitle: "Création de compte",
        email: req.body.u_email,
        username: req.body.u_username,
        pwd: req.body.u_pwd,
        error: error
    });
};