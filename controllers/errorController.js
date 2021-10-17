"use strict";

exports.getError404 = (req, res, next)=>{
    res.status(404).render('err/404');
};