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

module.exports = router;
