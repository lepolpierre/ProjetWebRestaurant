"use strict";


// Express
const express = require('express');
const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', "views");


app.use('/test', (req,res,next)=>{
    res.render('test');
});


app.use((req,res,next)=>{
    res.render('index');
});

app.listen(3000);