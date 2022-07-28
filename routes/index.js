const express = require('express');
const router = express.Router();
const bp = require('body-parser');

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
  res.render('index');
});

module.exports = router;
