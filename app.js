"use strict";

// Express
const express = require('express');
const app = express();

const mongoose = require('mongoose');

// EJS
app.set('view engine', 'ejs');
app.set('views', "views");

// Rooutes 
const adminRoutes = require('./routes/admin');
const restaurantRoutes = require('./routes/restaurant');

app.use('/admin', adminRoutes);
app.use(restaurantRoutes);


// app.use((req,res,next)=>{
//     res.render('index');
// });

mongoose
  .connect('mongodb://127.0.0.1:27017/noderesto')
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log("AHHHHHHHH :",err));
// app.listen(3000);