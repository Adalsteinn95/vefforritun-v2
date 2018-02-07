const express = require('express');

const router = express.Router();

function form(req, res) {
  const data = {};
  res.render('form', { data });
}

function submit(req, res) {
  res.render('form', {});
}

function login(req, res) {
  res.render('login', {});
}

function postLogin(req, res) {
}


router.get('/', form);
router.post('/', submit);

router.get('/login', login);
router.post('/login', postLogin);

module.exports = router;
