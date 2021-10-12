"use strict";


const plat = require('../model/menu');

// Récupère un article grâce à son id
//menu.push({name:"riz"})
let riz = new plat({name:"riz"});
let pattes = new plat({name:"pattes"});
riz.save();
pattes.save();
// console.log("PLAT : ",riz);

exports.getPlat = (req, res, next) => {
    console.log('req.params :', req.params);
    console.log('req.query :', req.query);
    const platId = req.query.id;
    plat.findById(platId)
    .then(plat => {
      res.render('plat', {
        plat: plat,
        pageTitle: plat.name
      });
    });
   };

