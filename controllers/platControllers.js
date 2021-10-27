"use strict";
var mongoose = require('mongoose');

const Plat = require('../model/menu');

// Récupère un article grâce à son id
//menu.push({name:"riz"})

// const noms = ["poulet","riz","pattes","rizoto","bolognaise","couscous","burger","pizza","naan","poutine","banane"];
// const description = ["un plat","un plat","un plat","un plat","un plat","un plat","un plat","un plat","un plat","un plat","un plat"];
// const categorie = ["repas","repas","repas","repas","repas","repas","repas","repas","repas","repas","repas"];
// const vege = [false,false,false,false,false,false,false,false,false,false,false];
// const prix = [10,9,14,12,15,11,10,9,10,10,10];

// for(let i=0; i < noms.length -1; i++) 
// {
//   let plat = new Plat({noms:noms[i]},{descriptioni:description[i]},{categorie:categorie[i]},{vege:vege[i]},{prix:prix[i]});
//   plat.save();
// }



//console.log("banane : ",poulet);
//console.log("mange:", mange  )

exports.getPlat = (req, res, next) => {
    // console.log('req.params :', req.params.platId);
  //  let id = mongoose.Types.ObjectId(req.params.platId.trim());
  //   // console.log("ID = ", id);
  //   const platId = req.params.platId;
  //   console.log('id  :', platId.length); 


    Plat.findById(req.params.platId)
    .then(plat => {
      res.render('plat', {
        plat: plat,
        pageTitle: plat.name
      });
    })
    .catch(err=>{
      if(err){
        console.error("ERREUR :",err);
        throw err;
      }
    });

};

