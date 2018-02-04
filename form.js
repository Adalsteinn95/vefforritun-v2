const express = require('express');

const router = express.Router();

function form(req, res) {
  const data = {};
  res.render('form', { data });
}

function submit(req, res) {
  console.log(req.body.email);


  res.render('form', {});
}

router.get('/', form);

router.post('/', submit);

module.exports = router;
