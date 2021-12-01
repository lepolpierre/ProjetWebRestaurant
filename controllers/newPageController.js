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
        titre: page[0].titre.replace(/-/g," ")
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

  // ajustement "string" de caractères dans la BD 
  console.log({contenu});
  let a = contenu.replace(/"/g," ");
  console.log({a});
  
  let b = titre.replace(/"/g," ");
  console.log("contenue",a);
  let page = new Page({ titre:b, contenu:contenu });

  
  page.save()
  .then(page => {
    console.log({page});
  })
  .catch(err=>next(err));
    
};


/**
 * Permet de récupérer l'ensemble des page crées.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
exports.getAllPages = (req,res,next)=>{
  Page.find()
  .then(plats=>{

    res.status(200).json({plats});

  })
  .catch(err=>next(err));
};
