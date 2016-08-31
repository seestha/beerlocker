// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var Client = require('../models/client');
var BearerStrategy = require('passport-http-bearer').Strategy;
var Token = require('../models/token');
var DigestStrategy = require('passport-http').DigestStrategy;
var LocalStrategy = require('passport-local').Strategy;

// passport.use(new BasicStrategy(
//   function(username, password, callback) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return callback(err); }
//
//       // No user found with that username
//       if (!user) { return callback(null, false); }
//
//       // Make sure the password is correct
//       user.verifyPassword(password, function(err, isMatch) {
//         if (err) { return callback(err); }
//
//         // Password did not match
//         if (!isMatch) { return callback(null, false); }
//
//         // Success
//         return callback(null, user);
//       });
//     });
//   }
// ));
//
// // exports.isAuthenticated = passport.authenticate('basic', { session : false });
// exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));

exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

// passport.use(new DigestStrategy(
//   { qop: 'auth' },
//   function(username, callback) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return callback(err); }
//
//       // No user found with that username
//       if (!user) { return callback(null, false); }
//
//       // Success
//       return callback(null, user, user.password);
//     });
//   },
//   function(params, callback) {
//     // validate nonces as necessary
//     callback(null, true);
//   }
// ));
//
// exports.isAuthenticated = passport.authenticate(['digest', 'bearer'], { session : false });

passport.use(new LocalStrategy(
  // { //just to change the parameter send name i.e. 'email' for 'username' and 'pass' for 'password'
  //   usernameField: 'email',
  //   passwordField: 'pass'
  // },
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate(['local', 'bearer'], { session : false });
