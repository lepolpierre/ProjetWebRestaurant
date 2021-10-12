"use strict";

const path = require('path');
// Express, MongoDb
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false})); // body parser
app.use(express.static(path.join(__dirname, 'public '))); // static files

// EJS
app.set('view engine', 'ejs');
app.set('views', "views");


// Routes 
const adminRoutes = require('./routes/admin');
const platRoutes = require('./routes/unPlat');

//app.use('/admin', adminRoutes);
// app.use(restaurantRoutes);
app.use('/plat', platRoutes);




// connection MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/resto')
  .then(() => {
    const server = app.listen(3000, ()=>{
      console.log(`Server running on port : ${server.address().port}`);
    });
  })
  .catch(err => console.error(`Erreur ${err}`));



