"use strict";

const Plat = require('../models/menu');
const User = require('../models/user');


//   recuperation d'un plat par l'id
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


// menu complet
exports.getMenu = (req, res, next) => {
  //loadPLat();
  Plat.find({categorie: req.param.categorie})
    .then(menu => {
      Plat.find()
      .then(menu => {
        res.render('menu', {
          user: req.user,
          menu: JSON.stringify(menu),
          utilisateur : JSON.stringify(req.user)
        });
      })
    });
};


// menu json pour verification payement
exports.getJson = (req, res, next) => {

  Plat.find()
    .then(menu => {
      res.render('menu/menujson', {
        user: req.user,
        menu: JSON.stringify(menu),
      });
    })

}
  
  

// ==============================================[ Ajout de plat par l'admin ]===========================




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
  // L'objet plat est parsé en JSON 
  console.log(JSON.parse(req.body.plat));
  const {name, desc, prix, vege, categorie} = JSON.parse(req.body.plat);
  console.log(req.files.file[0]);
  const file = req.files.file[0];

  if (!name || !desc || !prix  || !categorie || !file){
    next(new Error("Formulaire invalide, champs manquants!"));
  }


  // ajout de plat dans BD
  new Plat({
    name,vege,prix,categorie,
    description: desc,
    image: file.filename
  }).save((err,plat) =>{
    // attrappe erreur
    if(err)next(err);

    console.log("[/menu/plat/add  POST]  plat ajouté avec succès!");
    console.log(plat);
  })
  .catch(err=> next(err));

};


/**
 * Permet d'afficher la page modification de chaque repas.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.platModification = (req,res,next)=>{
  const {platId} = req.params;
  
  Plat.findById(platId)
  .then(plat=>{
    if(!plat){
      const err = new Error("Plat non trouvé !");
      err.statusCode = 404;
      err.code = "ID_INTROUVABLE";
      throw err;
    }

    // Envoyer à la page de modification.
    res.status(200).render('auth/modifier-plat', {
      pageTitle : `${plat.name}`,
      user: req.user,
      plat : JSON.stringify(plat)
    });
  })
  .catch(err=>next(err));
  
};



/**
 * Permet d'appliquer les modifications sur le plat dans la BD. 
 * @param {object} res 
 * @param {object} req 
 * @param {function} next 
 */
exports.updatePlat = (req,res, next)=>{
  // console.log(req);

  // L'objet plat est parsé en JSON 
  const {id, name, desc, prix, vege, categorie} = JSON.parse(req.body.plat);

  // Si admin change pas image de plat, req.body.file existe, contient 'null'. Sinon req.files contiendra l'objet File
  let nomFile;
  if(req.body.image.length> 1) nomFile = req.body.image;
  else{
    nomFile = req.files.file[0].filename;
  }

  console.log("[PLAT UPDATE, FILE NAME]",{nomFile});

 
  if (!name || !desc || !prix  || !categorie){
    next(new Error("Formulaire invalide, champs manquants!"));
  }

  // Mise à jour du plat.
  Plat.findById(id)
  .then(plat=>{
    plat.name = name;
    plat.vege = vege;
    plat.prix = prix;
    plat.categorie = categorie;
    plat.image =  nomFile;
    plat.description = desc;
    
    return plat.save();
  })
  .then(plat=>{
    console.log("[PLAT UPDATED]", {plat});
  })
  .catch(err=>next(err));


};


/**
 * Permet de supprimer un plat par l'admin.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.supprimerPlat = (req,res,next)=>{
  const {platId} = req.params;
  
  Plat.findByIdAndRemove(platId)
  .then(plat=>{
    console.log({plat});
  }).catch(err=>next(err));

};


