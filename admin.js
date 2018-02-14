const express = require('express');
const util = require('util');
const fs = require('fs');

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
  const result = await client.query('SELECT * FROM users');
  return result.rows;
}


router.get('/', ensureLoggedIn, async (req, res) => {
  const data = await fetchData();

  res.render('admin', {
    data,
  });
});

router.get('/download', async (req, res) => {
  const data = await fetchData();
  data.unshift({
    date: 'Date',
    name: 'Name',
    email: 'Email',
    amount: 'Amount',
  });

  const newData = data.map(item => `${item.date};${item.name};${item.email};${item.amount}\n`);

  const thisisIt = newData.join('');

  await writeCsv('table.csv', thisisIt);

  const csv = './table.csv';
  res.download(csv);
});

module.exports = router;
