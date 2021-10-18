"use strict";

const path = require('path');
// Express, MongoDb
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', "views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false})); // body parser
app.use('/public',express.static(path.join(__dirname, 'public'))); // static files


// Routes 
const adminRoutes = require('./routes/auth');
const platRoutes = require('./routes/unPlat');


app.use('/auth', adminRoutes);
app.use('/plat', platRoutes);

// Erreurs
const errors = require('./controllers/errorController');
app.use(errors.getError404);



// connection MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/resto')
  .then(() => {
    const server = app.listen(3000, ()=>{
      console.log(`Server running on port : ${server.address().port}`);
    });
  })
  .catch(err => console.error(`Erreur ${err}`));



