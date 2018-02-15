const express = require('express');
const util = require('util');
const fs = require('fs');
const Papa = require('papaparse');

const router = express.Router();

const connectionString = 'postgres://postgres:12345@localhost/vefforritun2';

const writeCsv = util.promisify(fs.writeFile);

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
  const result = await client.query('SELECT * FROM Registers');
  return result.rows;
}


router.get('/', ensureLoggedIn, async (req, res) => {
  const data = await fetchData();

  res.render('admin', {
    data,
  });
});

router.get('/download', async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }

  const data = await fetchData();

  const csv = await Papa.unparse(data, { delimiter: ';' });

  await writeCsv('table.csv', csv);

  const file = `${__dirname}/table.csv`;
  res.download(file);
});

module.exports = router;
