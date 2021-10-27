"use strict";
var mongoose = require('mongoose');
const Menu = require('../model/menu');
const resultsPerPage = 9;



exports.getMenu = (req, res, next) => {

    Menu.find()
    .then(menu => {
      const numOfResult = menu.length;
      const numOfPages = Math.ceil(numOfResult / resultsPerPage);
      console.log("numOf Result=",numOfResult);
      console.log("num of page = ", numOfPages);
      let page = req.query.page ? Number(req.query.page) : 1;
      if(page > numOfPages)
      {
        res.redirect('/?page='+encodeURIComponent(numOfPages));
      }else if (page<1){
        res.redirect('/?page='+encodeURIComponent('1'));
      }
      const startingLimit = (page -1) * resultsPerPage;
      Menu.find()
      .skip(startingLimit)
      .limit(resultsPerPage)
      .then(menuReduit =>{

        let iterator = (page - 5) < 1 ? 1 : page - 5;
        console.log("iterator=",iterator);
        let endingLink = (iterator + 9 ) <= numOfPages ? ( iterator + 9) : page + 
        (numOfPages - page);
        console.log("endlink",endingLink);
        console.log("numofpages= ",numOfPages);
        if(endingLink < (page + 4)){
          iterator -= (page+4) - numOfPages;
        }
        res.render('menu', {menu: menuReduit, page, iterator, endingLink, numOfPages});
      })
    });
  };

    //   res.render('menu', {
    //      menu: menu,
    //    });
    // })
    // .catch(err=>{
    //   if(err){
    //     console.error("ERREUR :",err);
    //     throw err;
    //   }
    // });


// };