"use strict";


const plat = require('../model/menu');

// Récupère un article grâce à son id
//menu.push({name:"riz"})
// let riz = new plat({name:"riz"});
// let pattes = new plat({name:"pattes"});
// riz.save();
// pattes.save();
// console.log("PLAT : ",riz);

exports.getPlat = (req, res, next) => {
    console.log('req.params :', req.params);
    const platId = req.params.platId;
 
    plat.findById(platId)
    .then(plat => {
      res.render('plat', {
        plat: plat,
        pageTitle: plat.name
      });
    })
    .catch(err=>{
      if(err){
        console.error(err);
        throw err;
      }
    });

};

