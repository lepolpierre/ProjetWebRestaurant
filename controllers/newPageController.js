"use strict";

const Page = require('../models/page');
const express = require("express");


//  recuperation de la nouvelle page dans la bd
exports.getNewpage = (req, res, next) => {
  Page.find(titre = req.params.title)
    .then(page => {
      res.render('newPage/newPage', {
        user: req.user,
        contenu: page.contenu,
        titre: page.titre
      });
    })
    .catch(err => {
      if (err) {
        console.error("ERREUR :", err);
        throw err;
      }
    });
};


// creation d'une nouvelle page rtf to html
exports.creatNewPage = (req, res, next) => {
  res.render('newPage/createPage', {
    user: req.user,
  });
};

// ajouter la page a la base de donnees
exports.addPage = (req, res, next) => {
  const  titre  = JSON.stringify(req.body.titre);
  const  contenu  = JSON.stringify(req.body.pageBody);

  let page = new Page({ titre:titre, contenu:contenu })
  page.save()
    
};
