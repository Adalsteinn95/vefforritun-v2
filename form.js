const express = require('express');
const {
  Client,
} = require('pg');

const xss = require('xss');

const connectionString = 'postgres://postgres:12345@localhost/vefforritun2';

const query = 'INSERT INTO users(name,email,ssn,amount) VALUES ($1,$2,$3,$4)';
const router = express.Router();

const {
  check,
  validationResult,
} = require('express-validator/check');


async function insert(values) {
  const client = new Client({
    connectionString,
  });
  client.connect();

  await client.query(query, values);

  await client.end();
}

function form(req, res) {
  const data = {};
  res.render('form', {
    data,
  });
}

async function submit(req, res) {
  const {
    name = '',
    email = '',
    amount = 0,
    ssn = '',
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(i => i.msg);
    return res.render('form', {
      errorMsg,
    });
  }

  await insert([xss(name), xss(email), xss(ssn), xss(amount)]);

  return res.redirect('thanks');
}

router.get('/', form);

router.post(
  '/',
  check('name').isLength({
    min: 1,
  }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({
    min: 1,
  }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({
    min: 1,
  }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('amount').isInt([{ min: 1 }]).withMessage('Fjöldi verður að vera meira en 1'),
  submit,
);


module.exports = router;
