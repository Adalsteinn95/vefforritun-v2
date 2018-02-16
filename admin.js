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


router.get('/', ensureLoggedIn, async (req, res, next) => {
  await fetchData()
    .then(async (data) => {
      res.render('admin', {
        data,
      });
    })
    .catch(() => {
      next();
    });
});

router.get('/download', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }

  await fetchData()
    .then(async (data) => {
      const filtered = data.map(file => ({
        date: file.date,
        name: file.name,
        email: file.email,
        amount: file.amount,
        ssn: file.ssn,
      }));

      const csv = await Papa.unparse(filtered, {
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
