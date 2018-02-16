const express = require('express');
const util = require('util');
const fs = require('fs');
const Papa = require('papaparse');

const router = express.Router();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:12345@localhost/vefforritun2';

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
  await fetchData()
    .then(async (data) => {
      res.render('admin', {
        data,
      });
    })
    .catch(() => {
      res.render('error');
    });
});

router.get('/download', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }

  await fetchData()
    .then(async (data) => {
      const csv = await Papa.unparse(data, {
        delimiter: ';',
      });
      await writeCsv('table.csv', csv);
      const file = `${__dirname}/table.csv`;
      res.download(file);
    })
    .catch(() => {
      next('error');
    });
});

module.exports = router;
