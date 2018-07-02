let express = require('express');
let router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Express' });
});

router.get('/Counter', function(req, res, next) {
    console.log('llegue aca papu');

    res.render('Counter',{layout: 'Counter_layout'});

});

router.get('/registration', function(req, res, next) {
    res.render('registration' );
});

module.exports = router;
