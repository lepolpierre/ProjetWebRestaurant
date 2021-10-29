'use strict';

const bcrypt = require('bcrypt'); // Hashage du mot de passe
const jwt = require('jsonwebtoken'); // JWT

// Mailgun
const mailgun = require('mailgun-js')(
    {
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
);

var LocalS = require('node-localstorage').LocalStorage;
LocalS = new LocalS('./localStorage');

const User = require('../model/user'); // Importation du modèle User de la BD

require('dotenv').config(); 






// Affiche le formulaire permettant à un visteur la création d'un compte utilisateur
exports.registerAccount = (req, res,next) => {
    res.render('signup', {
        pageTitle: "Création de compte"
    });
};


// Permet la création du compte utilisateur
exports.createAccount = (req, res,next) => {
    const { u_email, u_username, u_pwd, u_pwdConfirm } = req.body;


    // Verifier que tous les champs ont été fournis
    if (!u_email || !u_username || !u_pwd || !u_pwdConfirm) {
        res.status(400);
        returnSignInFormRempli(req, res, "Veuillez remplir tous les champs! ");
    }

    // Verifier que l'utilisateur désirant s'inscrire n'existe pas.
    User.findOne({ $or:[{email :  u_email}, {username: u_username}]},(err, user)=>{
        if (err) {
            // gestion erreur
            next(err);
        }

        if(user) returnSignInFormRempli(req,res, "Utilisateur existant avec ce nom d'utilisateur ou courriel");

        // Verifier les deux mots de passes.
        if (!verifierDeuxMDP(u_pwd, u_pwdConfirm)) {
            res.status(400);
            returnSignInFormRempli(req, res, "Les deux mots de passes doivent être identiques! ");
        }

        // Gener le salt et enregistrement de données.

        bcrypt.genSalt(10, (err, salt)=>{
            if (err) {
                next(err);
            }

            // Hashage du mot de passe.
            bcrypt.hash(u_pwd, salt).then( hash =>{
                // creation d'un nouvel utilisateur.
                const user = new User({
                    email: u_email,
                    username: u_username,
                    password: hash,
                    salt:salt
                });

                // Enregitrement des données dans la BD.
                user.save()
                .then((utilisateur) => {

                    // Envoie de courriel de vérification par mailgun
                    const message = `Veuillez vérifier votre courriel pour finaliser la création`+
                    `de votre compte sur NodeResto en cliquant ici : ${process.env.HOST}${process.env.PORT}/auth/signup/verify/${utilisateur._id}`;
                    console.log(message);
                    var data = {
                        from: 'NodeResto <me@samples.mailgun.org>',
                        to: "atoumi@edu.cegepgarneau.ca",
                        subject: 'Finir la création de votre compte',
                        
                        // Le contenu du courriel
                        text: message
                    };

                    mailgun.messages().send(data, (err, body)=>{

                        if(err){
                            throw err;
                        }
                        console.log(body);
                        
                        // Confirmation de création de courriel.
                        res.status(201).json({ msg: `utilisateur ${utilisateur.username} crée!` });
                    });
                    


                })
                .catch(err => {
                    // Erreur liée au serveur.
                    console.error(err);
                    returnSignInFormRempli(req, res, err.errors);
                });
                         
            })
            .catch(err=>{
               next(err);
            });
            

        });


    });


};



// Affiche le formulaire permettant à un utilisateur de se connecter
exports.loginForm = (req,res,next)=>{
    res.render('login', {
        pageTitle: "Connexion"
    });
};



exports.loginAccount = (req,res,next)=>{
    const {utilisateur, pass} = req.body;

    // Vérifier que les champs sont bien remplis.
    if(!utilisateur || !pass){
        res.status(404);
        returnLoginInFormRempli(req,res, "Veuillez remplir tous les champs.");
    }

    // Utilisateur désirant se connecter.
    let loginUser;

    User.find({$or:[{email:utilisateur}, {username:utilisateur}]})
    .then((user)=>{
        if(user.length < 1){
            res.status(404);
            returnLoginInFormRempli(req,res, "Utilisateur inéxitant");
        }
        
        loginUser = user[0];
        return bcrypt.compare(pass, user[0].password);
    })
    .then(egal=>{
        if(!egal){
            res.status(404);
            returnLoginInFormRempli(req,res, "Informations incorrectes");
        }
        // JWT
        const token = jwt.sign(
            {
                user: loginUser.username,
                userId : loginUser._id.toString()
            },
            // Secret Key
            process.env.JWT_SECRET_KEY,
            {expiresIn: 300}
        );
        LocalS.setItem('token', token);
     
        res.status(200).json({message: "Connecté!", token : token});
    })
    .catch(err=>{
        next(err);
    });


};



exports.isLoggedIn = (req,res,next)=>{
    const token = LocalS.getItem('token');
    if(token !== null){
        console.log(token);
        // Récupérer les données du token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
            if(err || !user){
                res.status(401).json({err:err});
            }
            
            // Enregistrement du token.
            req.user = user;
            next();

        });


    }

    res.status(301).render('login');



};



// Méthodes utiles


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
const returnSignInFormRempli = (req, res, error = "") => {
    res.render('signup', {
        pageTitle: "Création de compte",
        email: req.body.u_email,
        username: req.body.u_username,
        pwd: req.body.u_pwd,
        error: error
    });
};


/**
 * Renvoie le formulaire de connexion d'un utilisateur avec données pré-rempli.
 * @param {*} req 
 * @param {*} res 
 */
const returnLoginInFormRempli = (req,res, error = "")=>{
    res.render('login', {
        pageTitle: "Connexion",
        user: req.body.utilisateur,
        error: error
    });
  
};