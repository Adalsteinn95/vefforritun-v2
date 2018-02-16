const express = require('express');
const {
  Client,
} = require('pg');

const xss = require('xss');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:12345@localhost/vefforritun2';

const query = 'INSERT INTO Registers(name,email,ssn,amount) VALUES ($1,$2,$3,$4)';
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

  const user = req.user; // eslint-disable-line
  const errParam = [];

  res.render('form', {
    data,
    user,
    errParam,
    title: 'Form',
  });
}


function thankYou(req, res) {
  res.render('thanks', {});
}

router.get('/', form);
router.get('/thanks', thankYou);

router.post(
  '/',
  check('name').isLength({
    min: 1,
  }).withMessage('Nafn má ekki vera tómt')
    .trim()
    .not()
    .matches(/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]+/)
    .withMessage('Ekki reyna að gera eitthvad sniðugt! Þetta mun vera tilkynnt til Lögreglu!'),
  check('email').isLength({
    min: 1,
  }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang')
    .trim()
    .not()
    .matches(/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]+/)
    .withMessage('Ekki reyna að gera eitthvad sniðugt! Þetta mun vera tilkynnt til Lögreglu!'),
  check('ssn').isLength({
    min: 1,
  }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('amount').isInt([{
    min: 1,
  }]).withMessage('Fjöldi verður að vera meira en 0'),
  check('amount').custom((value) => {
    if (value < 1 && value > -1) {
      throw new Error('Fjöldi má ekki vera 0');
    }
    return true;
  }),
  check('amount').custom((value) => {
    if (value < 0) {
      throw new Error('Fjöldi má ekki vera minni en 0');
    }
    return true;
  }),
  async (req, res, next) => {
    const {
      name = '',
      email = '',
      amount = 0,
      ssn = '',
    } = req.body;

    const data = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map(i => i.msg);
      const errParam = errors.array().map(i => i.param);

      res.render('form', {
        errorMsg,
        data,
        errParam,
        title: 'Form',
      });
    }

    await insert([xss(name), xss(email), xss(ssn), xss(amount)])
      .then(() => res.redirect('thanks'))
      .catch(err => next(err));
  },
);


module.exports = router;
