"use strict";

const Plat = require('../model/menu');



// Récupère un article grâce à son id
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

