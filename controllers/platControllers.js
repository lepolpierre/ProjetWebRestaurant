"use strict";

const Plat = require('../models/menu');
const resultsPerPage = 9;

const loadPLat = () => {
  let noms = ["poulet", "riz", "pattes", "rizoto", "bolognaise", "couscous", "burger", "pizza", "naan", "poutine", "banane"];
  let description = ["un plat", "un plat", "un plat", "un plat", "un plat", "un plat", "un plat", "un plat", "un plat", "un plat", "un plat"];
  let categorie = ["repas", "repas", "repas", "repas", "repas", "repas", "repas", "repas", "repas", "repas", "repas"];
  let vege = [true, true, true, true, true, true, false, false, false, false, false];
  let prix = [10, 9, 14, 12, 15, 11, 10, 9, 10, 10, 10];


  for (let i = 0; i < 10; i++) {
    let plat = new Plat({ name: noms[i] ,  description: description[i] ,  categorie: "un plat" ,  vege: true ,  prix:  9});
    plat.save();
  }
};






// Récupère un article grâce à son id
exports.getPlat = (req, res, next) => {
  Plat.findById(req.params.platId)
    .then(plat => {
      res.render('plat', {
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



exports.getMenu = (req, res, next) => {
   //loadPLat();

  Plat.find()
    .then(menu => {
      const numOfResult = menu.length;
      const numOfPages = Math.ceil(numOfResult / resultsPerPage);
      console.log("numOf Result=", numOfResult);
      console.log("num of page = ", numOfPages);

      let page = req.query.page ? Number(req.query.page) : 1;
      if (page > numOfPages) {
        res.redirect('/menu/?page=' + encodeURIComponent(numOfPages));
      } else if (page < 1) {
        res.redirect('/menu/?page=' + encodeURIComponent('1'));
      }
      const startingLimit = (page - 1) * resultsPerPage;
      Plat.find()
        .skip(startingLimit)
        .limit(resultsPerPage)
        .then(menuReduit => {

          let iterator = (page - 5) < 1 ? 1 : page - 5;
          console.log("iterator=", iterator);
          let endingLink = (iterator + 9) <= numOfPages ? (iterator + 9) : page +
            (numOfPages - page);
          console.log("endlink", endingLink);
          console.log("numofpages= ", numOfPages);
          if (endingLink < (page + 4)) {
            iterator -= (page + 4) - numOfPages;
          }
          res.render('menu', {
            menu: menuReduit,
            page,
            iterator,
            endingLink,
            numOfPages
          });
        })
    });
};

exports.getMenuVege = (req, res, next) => {
   //loadPLat();
  console.log("BOOOOP");
  Plat.find({vege: true})
    .then(menu => {
      const numOfResult = menu.length;
      const numOfPages = Math.ceil(numOfResult / resultsPerPage);
      console.log("numOf Result=", numOfResult);
      console.log("num of page = ", numOfPages);

      let page = req.query.page ? Number(req.query.page) : 1;
      const startingLimit = (page - 1) * resultsPerPage;
      Plat.find()
        .skip(startingLimit)
        .limit(resultsPerPage)
        .then(menuReduit => {

          let iterator = (page - 5) < 1 ? 1 : page - 5;
          console.log("iterator=", iterator);
          let endingLink = (iterator + 9) <= numOfPages ? (iterator + 9) : page +
            (numOfPages - page);
          console.log("endlink", endingLink);
          console.log("numofpages= ", numOfPages);
          if (endingLink < (page + 4)) {
            iterator -= (page + 4) - numOfPages;
          }
          res.render('menu', {
            menu: menuReduit,
            page,
            iterator,
            endingLink,
            numOfPages
          });
        })
    });
};


