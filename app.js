const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const form = require('./form');
const admin = require('./admin');

const users = require('./users');
const passport = require('passport');
const {
  Strategy,
} = require('passport-local');


const app = express();

const sessionSecret = 'leyndarmál';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  res.status(500).render('error', { err });
}

function strat(username, password, done) {
  users
    .findByUsername(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      return users.comparePasswords(password, user);
    })
    .then(res => done(null, res))
    .catch((err) => {
      done(err);
    });
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users
    .findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }

  next();
});

function login(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/admin');
  } else {
    res.render('login', {});
  }
}

function postLogin(req, res) {
  res.redirect('/admin');
}


app.get('/login', login);
app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  postLogin,
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use('/admin', admin);
app.use('/', form);

//const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
});
