const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// mongo here
const connectMongo_async = require('./dbController');
let mdb;
let ObjectId;
connectMongo_async().then((data) => {
  mdb = data.db;
  ObjectId = data.ObjectId;
});

exports.authStrategy = new LocalStrategy(
  (username, password, done) => {
    mdb.collection('users')
      .findOne({ username }, (err, user) => {
        if(err) return done(err);
        if(!user) {
          return done(null, false, { type: 'error', message: 'Incorrect username or password. Please try again.' });
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false, { type: 'error', message: 'Incorrect username or password. Please try again.' });
          }
        });
      });
  }
);

exports.authSerializer = (user, done) => {
  done(null, user._id);
};

exports.authDeserializer = (id, done) => {
  mdb.collection('users')
    .findOne({ _id: ObjectId(id) }, (err, user) => {
      done(err, user);
    });
};

exports.restrict = (req, res, next) => {
  if (req.isUnauthenticated()) {
      res.flash('error', 'Access denied, please log in.');
      return res.redirect('/admin-login');
  }
  return next();
}

exports.login = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
        res.flash(info.type, info.message);
        return res.redirect('/admin-login'); 
    }

    req.logIn(user, function(err) {
        if (err) { return next(err); }
        res.flash('success', 'Logged in.');
        return res.redirect('/admin');
    });
  })(req, res, next);
}

exports.logout = (req, res, next) => {
  req.logout();
  res.flash('success', 'Logged out. Please login again.');
  res.redirect('/admin-login');
}

exports.user_create_post = (req, res, next) => {
  // TODO - should check if user is existed first,
  // but for now it's not needed.

  // hash user's password before saving it
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      return next(err);
    }

    mdb.collection('users')
      .insertOne({
        username: req.body.username,
        password: hash
      }, (err, result) => {
        if (err) { return next(err); }

        req.login(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/admin');
        });
      });
  });
}