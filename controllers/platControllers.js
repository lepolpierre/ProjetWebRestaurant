"use strict";




const Plat = require('../models/menu');
const resultsPerPage = 9;





const loadPLat = () => {
  let noms = ["poulet", "riz", "pattes", "rizoto", "bolognaise", "couscous", "burger", "pizza", "naan", "poutine", "banane"];
  let description = ["poulet rotit", "riz rond", "spagetti", "rizoto cervette", "pattes sauce bolognaise",
    "couscous traditionelle", "burger classic", "pizza toute garnie", "naan au fromage", "poutine classic", "banane plantin"
  ];
  let categorie = ["plat", "plat", "plat", "plat", "plat", "plat", "plat", "plat", "entrer", "plat", "dessert"];
  let vege = [false, true, true, false, false, false, false, false, true, true, true];
  let prix = [10.00, 9.00, 14.00, 12.00, 15.00, 11.00, 10.00, 9.00, 10.00, 10.00, 10.00];


  for (let i = 0; i < 11; i++) {
    let plat = new Plat({
      name: noms[i],
      description: description[i],
      categorie: categorie[i],
      vege: vege[i],
      prix: prix[i]
    });
    plat.save();
  }
};



//-------------------------------------------------------------------------------------------
//                       RECUPERER UN ARTICLE PAR L'ID
exports.getPlat = (req, res, next) => {
  Plat.findById(req.params.platId)
    .then(plat => {
      res.render('plat', {
        user: req.user,
        plat: plat,
        pageTitle: plat.name
      });
    })
    .catch(err => {
      if (err) {
        console.error("ERREUR :", err);
        throw err;
      }
    });
};


//-------------------------------------------------------------------------------------------
//                                     MENU COMPLET


exports.getMenu2 = (req, res, next) => {
  //loadPLat();
  Plat.find({categorie: req.param.categorie})
    .then(menu => {
      Plat.find()
      .then(menu => {
        res.render('menu2', {
          user: req.user,
          menu: JSON.stringify(menu),
        });
      })
    });
};


//-------------------------------------------------------------------------------------------
//                                     GET JSON


exports.getJson = (req, res, next) => {

  Plat.find()
    .then(menu => {
      res.render('menu2', {
        user: req.user,
        menu: JSON.stringify(menu),
      });
    })

  }
  
  

  // ==============================================[ Ajout de plat par l'admin ]==================

  
/**
 * Permet l'ajout d'un plat par l'utilisateur.
 * @param {Objet} req 
 * @param {Objet} res 
 * @param {function} next 
 */
exports.addPlatAdmin = (req,res,next)=>{
  const user = req.user;

  // admin connecté
  res.status(200).render('auth/plat-add', {
    pageTitle: "Ajout de plat",
    user: user,
  });
};




/**
 * Récupère les données du formulaire d'ajout de plat et l'insère dans la BD
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.addPlat = (req,res,next)=>{
  // console.log(req.body);

  // const {name, desc, prix, vege, categorie} = req.body;

  // if (!name || !desc || !prix  || !categorie ){
  //   next(new Error("Formulaire invalide, champs manquants!"));
  // }

  console.log("=========");
  console.log(req.body);
  console.log(req.file);

  // ajout de plat dans BD
  // new Plat({
  //   name,vege,prix,categorie,
  //   description: desc
  // }).save((err,plat) =>{
  //   if(err)next(err);

  //   console.log("[/menu/plat/add  POST]  plat ajouté avec succès!");
  //   console.log(plat);
  // })
  // .catch(err=> next(err));

};


