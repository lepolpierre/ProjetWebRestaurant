"use strict";

require('dotenv').config();
const path = require('path');
// Express, MongoDb
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', "views");

// Middlewares
// app.use(express.json());
app.use(express.urlencoded({ extended: false})); // body parser
app.use('/public',express.static(path.join(__dirname, 'public'))); // static files

// Routes 
const adminRoutes = require('./routes/auth');
const platRoutes = require('./routes/unPlat');
const menuRoutes = require('./routes/menu');

app.use('/auth', adminRoutes);
app.use('/plat', platRoutes);
app.use('/menu', menuRoutes);



// Erreurs
const errors = require('./controllers/errorController');
app.use(errors.getError404);


// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
  console.log('err', err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});



// connection MongoDB
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    const server = app.listen(3000, ()=>{
      console.log(`Server running on port : ${server.address().port}`);
    });
  })
  .catch(err => console.error(`Erreur ${err}`));



