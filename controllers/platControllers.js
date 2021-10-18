"use strict";
var mongoose = require('mongoose');

const plat = require('../model/menu');

// Récupère un article grâce à son id
//menu.push({name:"riz"})
let mange = new plat({name:"mange"});
let banane = new plat({name:"banane", description:"une banane",categorie:"fruit", vege:true, prix:5});

mange.save();
banane.save();
console.log("banane : ",banane);
console.log("mange:", mange  )

exports.getPlat = (req, res, next) => {
    console.log('req.params :', req.params.platId);

    let id = mongoose.Types.ObjectId(req.params.platId);
    console.log("ID = ", id);

    // const platId = req.params.platId;
    // console.log('id  :', platId);
    plat.findById(id)
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

