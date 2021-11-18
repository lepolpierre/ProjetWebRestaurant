"use strict";

const Plat = require('../models/menu');
const resultsPerPage = 9;

const loadPLat = () => {
  let noms = ["poulet", "riz", "pattes", "rizoto", "bolognaise", "couscous", "burger", "pizza", "naan", "poutine", "banane"];
  let description = ["poulet rotit", "riz rond", "spagetti", "rizoto cervette", "pattes sauce bolognaise", 
  "couscous traditionelle", "burger classic", "pizza toute garnie", "naan au fromage", "poutine classic", "banane plantin"];
  let categorie = ["plat", "plat", "plat", "plat", "plat", "plat", "plat", "plat", "entrer", "plat", "dessert"];
  let vege = [false, true, true, false, false, false, false, false, true, true, true];
  let prix = [10, 9, 14, 12, 15, 11, 10, 9, 10, 10, 10];


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

  Plat.find({categorie:req.param.categorie})
    .then(menu => {
      envoyerMenu2(menu, req, res, next)
    });
};


function envoyerMenu2(menu, req, res, next) {

  Plat.find()
    .then(menu => {
      res.render('menu2', {
        user: req.user,
        menu: JSON.stringify(menu),
      });
    })

}