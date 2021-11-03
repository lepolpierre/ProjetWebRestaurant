"use strict";

require("dotenv").config();               // .env

const bcrypt = require("bcrypt");         // bcrypt (Hashage du mot de passe)
const jwt = require("jsonwebtoken");      // JWT

// Mailgun
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

var LocalS = require("node-localstorage").LocalStorage;
LocalS = new LocalS("./localStorage");

const User = require("../models/user"); // Importation du modèle User de la BD



// ROUTES

/**
 * Affiche le formulaire permettant à un invité la création d'un compte utilisateur
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.registerUser = (req, res, next) => res.render("signup", {
    pageTitle: "Création de compte",
  });


/**
 * Permet la création du compte utilisateur
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.signupUser = (req, res, next) => {
  const {u_email,u_username,u_pwd,u_pwdConfirm} = req.body;

  // Vérifier que tous les champs ont été fournis
  if (!u_email || !u_username || !u_pwd || !u_pwdConfirm) {
    res.status(400);
    return returnSignInFormRempli(req, res, "Veuillez remplir tous les champs! ");
  }

  // Verifier que l'utilisateur désirant s'inscrire n'existe pas.
  User.findOne({ $or: [{email: u_email},{username: u_username}] }, (err, user) => {
      if (err)
        next(err);

      if (user)
        return returnSignInFormRempli(req,res,"Utilisateur existant avec ce nom d'utilisateur ou courriel");
      

      // Verifier les deux mots de passes.
      if (!verifierDeuxMDP(u_pwd, u_pwdConfirm)) {
        res.status(400);
        return returnSignInFormRempli(req,res,"Les deux mots de passes doivent être identiques! ");
      }


      // Générer le salt pour enregistrement de données.
      bcrypt.genSalt(10, (err, salt) => {
        if (err)
          next(err);

        // Hashage du mot de passe.
        bcrypt.hash(u_pwd, salt).then( hash => {
            // creation d'un nouvel utilisateur.
            const user = new User({
              email: u_email,
              username: u_username,
              password: hash,
              salt: salt,
            });

            // Enregitrement des données dans la BD et validation MailGun
            user
              .save()
              .then(utilisateur => {
                // Le contenu du courriel
                const message = `<h3>Bonjour ${utilisateur.username},</h3>` +
                  `<p>Veuillez vérifier votre courriel en cliquant ` +
                  `<a href="${process.env.HOST}${process.env.PORT}/auth/signup/verify/${utilisateur._id}"> ici </a>` +
                  `pour finaliser la création de votre compte NodeResto </p>`;

                // Envoie de courriel de vérification par mailgun
                var data = {
                  from: "NodeResto <signup@noderesto.ca>",
                  to: "atoumi@edu.cegepgarneau.ca",
                  subject: "Finir la création de votre compte",
                  html: message,
                };

                mailgun.messages().send(data, (err, body) => {
                  if (err) 
                    next(err);
                  
                  console.log(body);

                  // Confirmation de création de courriel.
                  res.status(201).json({
                    msg: `utilisateur ${utilisateur.username} crée! Valider votre courriel requise`,
                  });
                });

              })
              .catch(err => {
                // Erreur d'enregistrement de l'utilisateur.
                console.error(err);
                return returnSignInFormRempli(req, res, err.errors);
              });
        })
        .catch(err => next(err));

      });
  });

};

/**
 * Permet de valider le courriel d'un utilisateur.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.verifyUserEmail = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        // Envoyer la page d'erreurs.
        const err = new Error("Utilisateur invalide !");
        err.stausCode = 404;
        throw err;
      }

      console.log(user);

      user.verified = true;
      user.save().then(() => {
        res.render('login',{
          pageTitle:"Connexion",
          msg: "Vous êtes désormais vérifié"
        });
      });

    })
    .catch(err => next(err) );
};

/**
 * Affiche le formulaire permettant à un utilisateur de se connecter
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.loginUser = (req, res, next) => {
  if(req.user !== undefined){
    console.log(`[GET /login] :` , req.user);

    return res.render('infouser', {
      pageTitle: "Profil utilisateur",
      user: req.user
    });
  }

  // Renvoie la page de connexion si aucun utilisateur est authentifié.
  res.render("login", {
    pageTitle: "Connexion",
  });
};


/**
 * Permet la connexion du compte utilisateur
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.login = (req, res, next) => {
  const { utilisateur, pass} = req.body;

  // Vérifier que les champs sont bien remplis.
  if (!utilisateur || !pass) {
    res.status(404);
    return returnLoginInFormRempli(req, res, "Veuillez remplir tous les champs.");
  }

  // Utilisateur désirant se connecter.
  let loginUser;

  User.find({ $or: [ { email: utilisateur },{ username: utilisateur} ] } )
    .then(user => {
      if (user.length < 1) {
        res.status(404);
        return returnLoginInFormRempli(req, res, "Utilisateur inéxistant !");
      }

      loginUser = user[0];
      // Vérifier que l'utilisateur a vérifié son compte.
      if (!loginUser.verified) {
        res.status(401);
        return returnLoginInFormRempli( req, res, "Veuillez confirmer votre courriel !");
      }

      // Comparer les mots de passe.
      return bcrypt.compare(pass, loginUser.password);
    })
    .then(egal => {
      if (!egal) {
        res.status(404);
        return returnLoginInFormRempli(req,res,"Informations de connexion incorrectes !");
      }


      console.log(`[POST /login user] : ${loginUser}`);


      // JWT
      const token = jwt.sign(
        {
          username: loginUser.username,
          _id: loginUser._id.toString(),
        },
        // Secret Key
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '1h' }
      );
      // Enbregistrer le token
      LocalS.setItem("token", token);
      console.log(`[POST /login  Connected token] : ${token}`);


      res.status(200).render('infouser', {
        pageTitle: "Profil utilisateur",
        user:loginUser
      });

    })
    .catch(err => next(err) );
};



/**
 * Permet de récupérer l'adresse courriel de l'utilisateur
 * ayany oublié sont mot de passe 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns template
 */
exports.getRecoverUserEmail = (req, res, next) => res.render("getemailrecoverpwd", {
    pageTitle: "Récupération de compte",
  });



/**
 * Permet d'envoyer le courriel de récupération de compte
 * après oubli de mot de passe
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.sendRecoverEmail = (req, res, next) => {
  const {email} = req.body;

  if (!email) {
    return res.status(404).render("getemailrecoverpwd", {
      pageTitle: "Récupération de compte",
      error: "Veuillez indiquer votre adresse courriel.",
    });
  }

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        return res.status(404).render("getemailrecoverpwd", {
          pageTitle: "Récupération de compte",
          error: "Veuillez entrer une adresse courriel valide enregistrée avec votre compte",
          email: email,
        });
       
      }

      console.log(user);

      // contenu du message envoyé
      const message = `<h3>Bonjour ${user.username}, </h3> <p>Cliquez ` +
        `<a href=${process.env.HOST}${process.env.PORT}/auth/login/recover/${user._id}> ici </a>` +
        `pour récupérer votre compte. </p>`;

      // Envoie de courriel récupération de mot de passe
      let data = {
        from: "NodeResto <recover@noderesto.ca>",
        to: "atoumi@edu.cegepgarneau.ca",
        subject: "Récupération de compte NodeResto",
        html: message,
      };

      mailgun.messages().send(data, (err, body) => {
        if (err) next(err);

        console.log(body);

        res.status(200).json({
          message: "Vérifier votre boite de messagerie",
          body: body,
        });
      });
    })
    .catch(err => next(err) );
};



/**
 * Permet d'afficher le formulaire permettant le choix du
 * nouveau mot de passe choisi par l'utilisateur.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.recoverUser = (req, res, next) => {
  const {userId} = req.params;

  res.render("recoverpwd", {
    pageTitle: "Récupération de compte",
    id: userId,
  });
};



/**
 * Permet la modification du mot de passe de l'utilisateur après oubli.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */
exports.userPwdUpdate = (req, res, next) => {
  const {userid,mdp1,mdp2} = req.body;

  // Vérifier les données reçues.
  if (!userid) {
    const err = new Error("Utilisateur non authentifié!");
    err.statusCode = 401;
    throw err;
  }

  if (!mdp1 || !mdp2) {
    return res.status(400).render("recoverpwd", {
      pageTitle: "Récupération de compte",
      id: userid,
      error: "Veuillez remplir tous les champs correctement.",
    });
  }

  if (!verifierDeuxMDP(mdp1, mdp2)) {
    return res.status(400).render("recoverpwd", {
      pageTitle: "Récupération de compte",
      id: userid,
      error: "Les deux mots de passes doivent être identiques.",
    });
  }

  // Recherche
  User.findById(userid)
    .then(user => {
      
      if (!user){
        const err = new Error("Aucun utilisateur trouvé!");
        err.statusCode = 404;
        throw err;
      }
      
      bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        
        bcrypt
        .hash(mdp1, salt)
        .then(hash => {
          user.password = hash;
          user.salt = salt;
          
          user.save()
          .then(() => {
              res.status(201).render('login', {
                pageTitle: "Connexion",
                msg: "Modifié avec succès, veuillez vous connectez de nouveau !"
              });

            });
          })
          .catch(err => next(err));
      });
    })
    .catch(err => next(err));
};




/**
 * Permet la déconnexion d'un utilisateur.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.disconnect = (req,res,next) => {
  const {userId} = req.params;

  const token = LocalS.getItem('token');

  if( token !== null){
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
      if(err || !user)
        return res.status(401).json({err:err});

      if(user._id !== userId){
        const err = new Error("Utilisateur non reconnu");
        err.statusCode = 400;
        throw err;
      }
      
      console.log("[GET /login/disconnect/...  GoodBye]", user);
      // Supprimer le token
      LocalS.removeItem('token');
      
    });
    
  }
  
  res.status(301).render('login',{
    msg: "Déconnecté"
  });
  
};




// Méthodes utiles

/**
 * Permet de vérifier si les deux mots de passes concordent.
 * @param {String} mdp1
 * @param {String} mdp2
 * @returns True ou False
 */
const verifierDeuxMDP = (mdp1, mdp2) =>  mdp1 === mdp2;

/**
 * Renvoie le formulaire de création d'utilisateur avec données pré-rempli
 * @param {object} req
 * @param {object} res
 * @param {string} error
 */
const returnSignInFormRempli = (req, res, error = "") => res.render("signup", {
    pageTitle: "Création de compte",
    email: req.body.u_email,
    username: req.body.u_username,
    pwd: req.body.u_pwd,
    error: error,
  });


/**
 * Renvoie le formulaire de connexion d'un utilisateur avec données pré-rempli.
 * @param {object} req
 * @param {object} res
 * @param {string} error
 */
const returnLoginInFormRempli = (req, res, error = "") => res.render("login", {
    pageTitle: "Connexion",
    user: req.body.utilisateur,
    error: error,
  });
