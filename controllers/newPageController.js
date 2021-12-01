"use strict";

const Page = require('../models/page');
const express = require("express");


// creation d'une nouvelle page rtf to html
exports.creatNewPage = (req, res, next) => {
  res.render('newPage/createPage', {
    pageTitle: "Création de ta page",
    user: req.user,
  });
};



//  recuperation de la nouvelle page dans la bd
exports.getNewpage = (req, res, next) => {
  console.log("titre",   req.params.titre );

  Page.find({titre: req.params.titre })
    .then(page => {
      console.log({page});
      
      res.render('newPage/newPage', {
        user: req.user,
        contenu: page[0].contenu,
        titre: page[0].titre
      });
    })
    .catch(err => {
      if (err) {
        console.error("ERREUR :", err);
        throw err;
      }
    });
};



// ajouter la page a la base de donnees
exports.addPage = (req, res, next) => {
  const  titre  = req.body.titre.toString().replace(/ /g, "-");
  let  contenu  = req.body.pageBody.toString();

  let search = '"';
  // ajustement "string" de caractères dans la BD 
  let a = contenu.replace(/"/g," ");
  let b = titre.replace(/"/g," ");
  console.log("contenue",a);
  let page = new Page({ titre:b, contenu:a });

  
  page.save()
  .then(page => {
    console.log({page});
  })
  .catch(err=>next(err));
    
};
