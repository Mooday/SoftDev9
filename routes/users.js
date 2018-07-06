var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Sucursal = require('../models/sucursal');

// Register
router.get('/register', ensureAuthenticated, function(req, res) {
    console.log(req.user.role);
    if(req.user.role == "Administrador") {
        Sucursal.find(function (err, succ) {
            if (err) {
                console.log(err);
            } else {
                console.log(succ);
                res.render('register', {succ: succ});
            }
        });
    }else{
        res.render('errorpage');
    }
});

// Login
router.get('/login', function (req, res) {
    res.render('login')
});

// Register User
router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var role = req.body.role;
    var sucursal = req.body.sucursal;
    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('role', 'Role is required').notEmpty();
    req.checkBody('sucursal', 'Sucursal is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('body_error', 'No se ha podido crear el usuario. Introduzca nuevos datos.');
        res.redirect('/users/register');
    }
    else {
        //checking for email and username are already taken
        User.findOne({ username: {
                "$regex": "^" + username + "\\b", "$options": "i"
            }}, function (err, user) {
            User.findOne({ email: {
                    "$regex": "^" + email + "\\b", "$options": "i"
                }}, function (err, mail) {
                if (user || mail) {
                    req.flash('body_error', 'User already exists.');
                    res.redirect('/users/register');
                }
                else {
                    const newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password,
                        role: role,
                        sucursal: sucursal
                    });
                    User.createUser(newUser, function (err, user) {
                        if (err) throw err;
                        console.log(user);
                    });
                    req.flash('body_msg', 'El usuario ha sido registrado.');
                    res.redirect('/users/register');
                }
            });
        });
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
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