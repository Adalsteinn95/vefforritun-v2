const express = require('express');

const router = express.Router();

/* todo */

function admin(req, res) {
  console.log('hallo');

  res.render('admin',{});
}

router.get('/', admin);

module.exports = router;
