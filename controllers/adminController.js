'use strict';


exports.registerAccount= (req,res)=>{
    res.render('registerForm', {
        pageTitle: "Création de compte"
    });
};


exports.createAccount = (req,res)=>{
  
    
    // erreur
    res.render('registerForm', {
        email : req.body.u_email,
        username : req.body.u_username,
        pwd : req.body.u_pwd
    });
};