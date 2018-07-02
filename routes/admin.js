var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var Users=require('../models/user');
var Sucursal=require('../models/sucursal');
var Routes=require('../models/route');
var Subroutes=require('../models/subroute');
var Fleet=require('../models/fleet');
var Pedido=require('../models/pedido');

router.get('/userlist', ensureAuthenticated, function(req, res) {
    if(req.user.role == "Administrador") {
        Users.find(function (err, user) {
            if (err) {
                console.log(err);
            } else {
                console.log(user);
                res.render('userlist', {users: user});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.get('/sucursal', ensureAuthenticated,function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Logistica") {
        res.render('sucursal');
    }else{
        res.render('errorpage');
    }
});

router.post('/addsucursal', ensureAuthenticated, async (req, res, next) => {
    const sucursal = new Sucursal(req.body);
    await sucursal.save();
    req.flash('Sucursal creada exitosamente.');
    res.redirect('/admin/sucursal');
});

router.get('/suclist', ensureAuthenticated, function(req, res) {
    if(req.user.role == "Logistica") {
        Sucursal.find(function (err, succ) {
            if (err) {
                console.log(err);
            } else {
                console.log(succ);
                res.render('suclist', {sucursal: succ});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.get('/routes', ensureAuthenticated,function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Logistica") {
        Sucursal.find(function (err, succ) {
            if (err) {
                console.log(err);
            } else {
                console.log(succ);
                res.render('routes', {sucursal: succ});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.post('/addroute', ensureAuthenticated,async (req, res, next) => {
    const route = new Routes(req.body);
    await route.save();
    req.flash('Ruta creada exitosamente.');
res.redirect('/admin/routes');
});

router.get('/routeslist', ensureAuthenticated,function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Logistica") {
        Routes.find(function (err, route) {
            if (err) {
                console.log(err);
            } else {
                console.log(route);
                res.render('routeslist', {routes: route});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.get('/subroute/:idn', ensureAuthenticated,function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Logistica") {
        Sucursal.find(function (err, succ) {
            if (err) {
                console.log(err);
            } else {
                console.log(succ);
                Subroutes.find({idn:req.params.idn},function (err, sub) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(sub);
                        res.render('subroutes', {routes:{succ:succ,subroute:sub, idn:req.params.idn}});
                    }
                });
            }
        });
        /*const succ = Sucursal.find({});
        const subroute = Subroutes.find({idn:req.params.idn});
        console.log(succ);
        res.render('subroutes', {routes:{succ:succ,subroute:subroute, idn:req.params.idn}});*/
    }else{
        res.render('errorpage');
    }
});

router.post('/addsubroute', ensureAuthenticated, async (req, res, next) => {
    const route = new Subroutes(req.body,);
    await route.save();
    req.flash('Ruta creada exitosamente.');
    res.redirect('/admin/subroute/'+req.body.idn);
});

router.get('/deleteuser/:id', ensureAuthenticated,async (req,res,next) => {
    if(req.user.role == "Administrador") {
        await Users.remove({_id:req.params.id});
        res.redirect('/admin/userlist');
    }else{
        res.render('errorpage');
    }
});

router.get('/fleet', ensureAuthenticated,function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Logistica") {
        Fleet.find(function (err, fleet) {
            if (err) {
                console.log(err);
            } else {
                console.log(fleet);
                res.render('fleet', {fleet: fleet});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.post('/addfleet', ensureAuthenticated, async (req, res, next) => {
    const fleet = new Fleet(req.body);
    await fleet.save();
    res.redirect('/admin/fleet');
});

router.get('/editfleet/:id', ensureAuthenticated, async (req, res, next) => {
    const fleet = await Fleet.findById({_id: req.params.id});
    //const fleet = await Fleet.findById(req.params.id);
console.log(fleet);
res.render('editfleet', { fleet });
});

router.post('/editfleet/:id', ensureAuthenticated,async (req, res) => {
    //const id = req.params.id;
    await Fleet.update({_id: req.params.id}, req.body);
res.redirect('/admin/fleet');
});

router.get('/deletefleete/:id', ensureAuthenticated, async (req, res) => {
    let id  = req.params;
await Fleet.remove({_id: id});
res.redirect('/fleet');
});

router.get('/pedido', ensureAuthenticated, function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Recepcion") {
        Sucursal.find(function (err, succ) {
            if (err) {
                console.log(err);
            } else {
                console.log(succ);
                res.render('pedido', {succ: succ});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.post('/addpedido', ensureAuthenticated, async (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var desc1 = req.body.desc1;
    var tipo = req.body.tipo;
    var desc2 = req.body.desc2;
    var receiver = req.body.receiver;
    var size = req.body.size;
    var weight = req.body.weight;
    var origen = req.body.origen;
    var destino = req.body.destino;
    var code = req.body.code;
    var track = randomValueHex(12);
    const newPedido = new Pedido({
        name : name,
        email : email,
        phone : phone,
        desc1 : desc1,
        tipo : tipo,
        desc2 : desc2,
        receiver : receiver,
        size : size,
        weight : weight,
        origen : origen,
        destino : destino,
        code : code,
        track : track
    });
    await newPedido.save();
    req.flash('body_msg', 'Tu codigo de tracking es: '+track);
    res.redirect('/admin/pedido');
});

router.get('/pedidolist', ensureAuthenticated,function(req,res){
    console.log(req.user.role);
    if(req.user.role == "Recepcion") {
        Pedido.find(function (err, pedido) {
            if (err) {
                console.log(err);
            } else {
                console.log(pedido);
                res.render('pedidolist', {pedido: pedido});
            }
        });
    }else{
        res.render('errorpage');
    }
});

router.get('/deletepedido/:id', ensureAuthenticated, async (req, res) => {
    await Pedido.remove({_id: req.params.id});
res.redirect('/admin/pedidolist');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

function randomValueHex(len) {
    return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len);
}

module.exports = router;