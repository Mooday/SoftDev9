var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users=require('../models/user');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
    /*var role = req.user.role;
    if(role=="Administrador"){
        res.render('index');
    }else{
        console.log('works');
    }*/
    res.render('index');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;