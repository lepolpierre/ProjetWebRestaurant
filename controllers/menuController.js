"use strict";
var mongoose = require('mongoose');
const menu = require('../model/menu');



exports.getMenu = (req, res, next) => {

  // menu.find()
  // .then(tous=>{
  //   res.json({
  //     menu:tous
  //   });
  // });


    menu.find()
    .then(menu => {
      res.render('menu', {
        menu: menu,
      });
    })
    .catch(err=>{
      if(err){
        console.error("ERREUR :",err);
        throw err;
      }
    });

};