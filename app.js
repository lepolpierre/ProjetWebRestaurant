"use strict";

require('dotenv').config();       // .env
const ngrok = require('ngrok');


const path = require('path');

const express = require('express');   // Express
const app = express();
const mongoose = require('mongoose'); // Mongoose

// EJS
app.set('view engine', 'ejs');
app.set('views', "views");

// Middlewares
app.use(express.json());        // JSON
app.use(express.urlencoded({ extended: false})); // body parser
app.use('/public',express.static(path.join(__dirname, 'public'))); // static files
const {isConnected} = require('./middlewares/auth');



// Routes 
const adminRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const newPageRoutes = require('./routes/newPage');



// Header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});





app.use('/auth', adminRoutes);
app.use('/menu', menuRoutes);
app.use('/newPage', newPageRoutes);


// Acceuil
app.use('/', isConnected, (req,res,next)=>{
  res.status(200).render('index', {
    pageTitle: "Acceuil",
    user: req.user
  });
});




// Erreurs 404
const errors = require('./controllers/errorController');


app.use(isConnected, errors.getError404);



// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.log('[ExpressError]', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});


// connection ngrok
(async function() {
  const url = await ngrok.connect(3000);
})();



// connection MongoDB
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    app.listen(process.env.PORT, ()=>{
      console.log(`Server running on port : ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(`Erreur :  ${err}`));



