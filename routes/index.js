const express = require('express');
const router = express.Router();
const bp = require('body-parser');
const path = require('path');
const AppUser = require('../models/user');
const Request = require('../models/request');
const passport = require('passport');
const middleware = require('../middleware');

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
router.get('/home', middleware.isLoggedIn, (req, res) => {
  Request.find({ author: req.user.username }, (err, allrequests) => {
    if (err) {
      console.log('Error in find');
      console.log(err);
    } else {
      // counts = Request.find({ author: req.user.username }).count();
      res.render('index', {
        requests: allrequests.reverse(),
        currentUser: req.user,
        // totalcount: counts,
      });

      // console.log('Total Docs : ' + counts);
      // console.log('author type' + allrequests.author);
      // console.log('Hey');
      // console.log('UserName ' + req.user.username);
      // console.log(typeof req.user.username);
    }
  });
  // .Request.countDocuments({ author: req.user.username }, (err, count) => {
  //   console.log(count);
  //   if (err) {
  //     console.log('Error in find');
  //     console.log(err);
  //   } else {
  //     res.render('index', {
  //       totalcount: count,
  //       currentUser: req.user,
  //     });
  //   }
  // });
});

// show settings page
router.get('/settings', middleware.isLoggedIn, (req, res) => {
  res.render('app-settings');
});

// show notifications page
router.get('/notifications', middleware.isLoggedIn, (req, res) => {
  res.render('app-notifications');
});

// show notifications detail page
router.get('/notifications-detail', middleware.isLoggedIn, (req, res) => {
  res.render('app-notification-detail');
});

// show detai request page
router.get('/request-detail', middleware.isLoggedIn, (req, res) => {
  res.render('app-request-detail');
});

// show request page
router.get('/request', middleware.isLoggedIn, (req, res) => {
  res.render('scanqr');
});

// handle request logic
router.post('/sendrequest', middleware.isLoggedIn, (req, res) => {
  var pname = req.body.pname;
  var size = req.body.size;
  var height = req.body.height;
  var width = req.body.width;
  var weight = req.body.weight;
  var author = req.user.username;
  var address = req.user.address;

  // var author = {
  //   id: req.user._id,
  //   username: req.user.username,
  //   email: req.user.email,
  // };

  var newRequest = {
    address: address,
    author: author,
    pname: pname,
    size: size,
    height: height,
    width: width,
    weight: weight,
  };

  console.log(req.body);
  console.log(req.user);
  console.log('USERNAME : ' + req.user.username);

  //Save to database
  Request.create(newRequest, (err, newlyCreated) => {
    if (err) {
      console.log('Error in inserting into DB');
      res.render('scanqr', {
        message: 'Failed To Request',
      });
    } else {
      res.render('scanqr', {
        message: 'Request Successfull',
      });
    }
  });
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
    address: req.body.address,
  });
  AppUser.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('app-register', {
        message: 'This Email is Already Exists',
      });
    }
    passport.authenticate('local')(req, res, () => {
      res.render('index', { currentUser: req.user });
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

// handle logout logic
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
