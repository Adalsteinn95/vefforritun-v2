const express = require('express');

const router = express.Router();

const connectionString = 'postgres://postgres:12345@localhost/vefforritun2';

const {
  Client,
} = require('pg');

/* todo */

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

async function fetchData() {
  const client = new Client({
    connectionString,
  });

  await client.connect();
  const result = await client.query('SELECT * FROM users'); 
  return result.rows;
}

router.get('/', ensureLoggedIn, (req, res) => {
  const data = fetchData();

  data
    .then((result) => {
      res.render('admin', {
        result,
      });
    });
});


module.exports = router;
