"use strict";

// Express
const path = require('path')
const express = require('express');
const mongoose = require('mongoose');
const app = express();


// EJS
app.set('view engine', 'ejs');
app.set('views', "views");

// Routes 
//const adminRoutes = require('./routes/admin');
const platRoutes = require('./routes/unPlat');

//app.use('/admin', adminRoutes);
app.use('/plat', platRoutes);

app.use(express.urlencoded({
  extended: false
}));

app.use((req,res,next)=>{
    res.render('index');
});

mongoose
  .connect('mongodb://127.0.0.1:27017/resto')
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log("AHHHHHHHH :",err));

//app.listen(3000);