const express = require('express');
const router = express.Router();
const bp = require('body-parser');
const path = require('path');
const AppUser = require('../models/user');
const Request = require('../models/request');
const passport = require('passport');

// Show login form on homepage
router.get('/', (req, res) => {
  res.render('app-login');
});

router.get('/login', (req, res) => {
  res.render('app-login');
});

//show register form
router.get('/register', (req, res) => {
  res.render('app-register');
});

// show homepage
router.get('/home', (req, res) => {
  res.render('index', {
    currentUser: req.user,
  });
});

// show settings page
router.get('/settings', (req, res) => {
  res.render('app-settings');
});

// show notifications page
router.get('/notifications', (req, res) => {
  res.render('app-notifications');
});

// show notifications detail page
router.get('/notifications-detail', (req, res) => {
  res.render('app-notification-detail');
});

router.get('/request', (req, res) => {
  res.render('scanqr');
});

// handle request logic
router.post('/sendrequest', (req, res) => {
  var pname = req.body.pname;
  var size = req.body.size;
  var height = req.body.height;
  var width = req.body.width;
  var weight = req.body.weight;

  console.log(req.body);
});

// handle login logic
//handle login logic
// ----------> router.post('/login', middleware, callback)
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
  }),
  (req, res) => {}
);

// habdle signup logic

router.post('/register', (req, res) => {
  console.log(req.body);
  const pass = req.body.password;
  const confirmPass = req.body.confirmpassword;
  const email = req.body.email;
  var newUser = new AppUser({
    username: req.body.username,
    email: email,
  });
  AppUser.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('app-register', {
        message: 'This Email is Already Exists',
      });
    }
    passport.authenticate('local')(req, res, () => {
      res.render('index');
    });
  });
});

//handle signup logic
// router.post('/register', (req, res) => {
//   console.log(req.body);
//   var schema = new passwordValidator();
//   const pass = req.body.password;
//   const confirmPass = req.body.confirmpassword;
//   schema.is(pass).min(8);
//   const email = req.body.email;

//   if (isEmailValid.validate(email)) {
//     if (schema.validate(pass) && pass == confirmPass) {
//       var newUser = new AppUser({
//         username: req.body.username,
//         email: email,
//       });
//       AppUser.register(newUser, req.body.password, (err, user) => {
//         if (err) {
//           console.log(err);
//           return res.render('register', {
//             message: 'This Email is Already Exists',
//           });
//         }
//         passport.authenticate('local')(req, res, () => {
//           res.render('index');
//         });
//       });
//     } else {
//       return res.render('register', {
//         message: 'Password is Too Short / Passwords Do Not Match',
//       });
//     }
//   } else {
//     return res.render('register', {
//       message: 'This Email is Invalid',
//     });
//   }
// });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/app-login');
}

module.exports = router;
