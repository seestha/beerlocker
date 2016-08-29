//get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Beer = require('./models/beer');
var bodyParser = require('body-parser');
var beerController = require('./controllers/beer.js');
var userController = require('./controllers/user.js');
var passport = require('passport');
var authController = require('./controllers/auth');

//connect to beerlocker mongoDB
mongoose.connect('mongodb://localhost:/27017/beerlocker');

//create our express application
//main component  used to define routes, start listening for http connections, and perform routing for requests
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Use the passport package in our application
app.use(passport.initialize());

var router = express.Router(); // express router, mini app only capable of performing middleware and routing

// Create endpoint handlers for /beers
router.route('/beers')
  .post(authController.isAuthenticated, beerController.postBeers)
  .get(authController.isAuthenticated, beerController.getBeers);

// Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
  .get(authController.isAuthenticated, beerController.getBeer)
  .put(authController.isAuthenticated, beerController.putBeer)
  .delete(authController.isAuthenticated, beerController.deleteBeer);

// create endpoint handlers for /user
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// router.get('/',function(req,res){
//   res.json({message:'this is for tesing purpose only'});
// })

//*** New Code Below Here ***//
// var beersRoute = router.route('/beers');
//
// //post new beer
// beersRoute.post(function(req,res){
//   var beer = new Beer();
//   beer.name = req.body.name;
//   beer.type = req.body.type;
//   beer.quantity = req.body.quantity;
//   beer.save(function(err){
//     if (err)
//       res.send(err);
//     res.json({message:"beer added to locker", data:beer});
//   });
// });
//
// //get all beer
// beersRoute.get(function(req,res){
//   Beer.find(function(err,beers){
//     if (err)
//       res.send(err);
//     res.json(beers);
//   });
// });
//
// //get single beer
// var singleBeerRoute = router.route('/beers/:beer_id');
// singleBeerRoute.get(function(req,res){
//   Beer.findById(req.params.beer_id,function(err,beer){
//     if (err)
//       res.send(err);
//     res.json(beer);
//   });
// });
//
// //update beer
// singleBeerRoute.put(function(req,res){
//   Beer.findById(req.params.beer_id,function(err,beer){
//     if (err)
//       res.send(err);
//     beer.quantity = req.body.quantity;
//     beer.save(function(err) {
//       if (err)
//         res.send(err);
//
//       res.json(beer);
//     });
//   })
// });
//
// //delete beer
// singleBeerRoute.delete(function(req,res){
//   Beer.findByIdAndRemove(req.params.beer_id,function(err){
//     if (err)
//       res.send(err);
//     res.json({message : "Beer deleted successfully"});
//   })
// });

//register all our route with app
app.use('/api',router); //use of prefix ‘/api’ means that all defined routes will be prefixed with ‘/api’
//start server
app.listen(port);
