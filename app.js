"use strict";

require('dotenv').config();       // .env

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

// Routes 
const adminRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');


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



// Erreurs 404
const errors = require('./controllers/errorController');
const {isConnected} = require('./middlewares/auth');


app.use(isConnected, errors.getError404);



// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.log('[ExpressError]', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});



// connection MongoDB
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    app.listen(process.env.PORT, ()=>{
      console.log(`Server running on port : ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(`Erreur :  ${err}`));



