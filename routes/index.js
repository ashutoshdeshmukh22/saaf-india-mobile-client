const express = require('express');
const router = express.Router();
const bp = require('body-parser');
const path = require('path');
const AppUser = require('../models/user');
const Request = require('../models/request');
const passport = require('passport');
const middleware = require('../middleware');
const file = require('fs');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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'
);

// router.use(express.static(__dirname + '/public/'));
router.use('/public', express.static('public'));

if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var Storage = multer.diskStorage({
  destination: 'public/uploads',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: Storage }).single('profile');

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

// show forgotpassword page
router.get('/forgotpassword', (req, res) => {
  res.render('app-forgot-password');
});
// show contact page
router.get('/support', (req, res) => {
  res.render('app-contact');
});

// show homepage
router.get('/home', middleware.isLoggedIn, (req, res) => {
  Request.find({ author: req.user.username }, (err, allrequests) => {
    if (err) {
      console.log('Error in find');
      console.log(err);
    } else {
      AppUser.find({ username: req.user.username }, (err, data) => {
        if (err) {
          console.log('Error in find');
          console.log(err);
        } else {
          res.render('index', {
            profileimg: data[0].profileimg,
            requests: allrequests.reverse(),
            currentUser: req.user,
            totalcount: allrequests.length,
          });
          // res.render('index', {
          //   profileimg: data[0].profileimg,
          // });
          // console.log(data[0]);
        }
      });
      // res.render('index', {
      //   requests: allrequests.reverse(),
      //   currentUser: req.user,
      //   totalcount: allrequests.length,
      // });
    }
  });
});

// show settings page
router.get('/settings', middleware.isLoggedIn, (req, res) => {
  AppUser.find({ username: req.user.username }, (err, data) => {
    if (err) {
      console.log('Error in find');
      console.log(err);
    } else {
      res.render('app-settings', {
        profileimg: data[0].profileimg,
        currentUser: req.user,
      });
      // res.render('index', {
      //   profileimg: data[0].profileimg,
      // });
      // console.log(data[0]);
    }
  });
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
  // var author = req.user.username;
  var address = req.user.address;
  var mobile = req.user.mobile;

  var author = {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  };

  var newRequest = {
    address: address,
    author: author,
    mobile: mobile,
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
      const msg = {
        to: req.user.email, // Change to your recipient
        from: 'pp0428281@gmail.com', // Change to your verified sender
        subject: 'Saaf India - Request Successfull',
        text: 'Saaf India - Request Successfull',
        html: '<table><tr><td><center><img src="https://espumil.com.br/wp-content/uploads/2021/03/simbolo-reciclagem-1.png" alt=""height="300" width="400"></center></td></tr><tr><td><center><h1>Request Successfull</h1></center></td></tr></table>',
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
        });

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
  (req, res) => {
    AppUser.find({ username: req.user.username }, (err, data) => {
      if (err) {
        console.log('Error in find');
        console.log(err);
      } else {
        res.render('index', {
          profileimg: data.username,
        });
        console.log(data);
      }
    });
  }
);
// habdle signup logic

router.post('/register', upload, (req, res) => {
  console.log(req.body);
  const pass = req.body.password;
  const confirmPass = req.body.confirmpassword;
  const email = req.body.email;

  var newUser = new AppUser({
    username: req.body.username,
    email: email,
    mobile: req.body.mobile,
    address: req.body.address,
    profileimg: req.file.filename,
  });
  console.log('filename ' + req.file.filename);

  AppUser.register(newUser, pass, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('app-register', {
        message: 'This Email is Already Exists',
      });
    }
    passport.authenticate('local')(req, res, () => {
      res.render('index', {
        currentUser: req.user,
        profileimg: req.file.filename,
      });
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
