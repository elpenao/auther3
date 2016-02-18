'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

// passport.use(new HashStrategy(
//   function(hash, done) {
//     User.findOne({ hash: hash }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (!user.isUnconfirmed()) { return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

// router.get('/confirm/:hash', 
//   passport.authenticate('hash', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
// });

router.post('/login', function (req, res, next) {
	User.findOne({ email: req.body.email })
    .then(function (user) {
       // user.correctPassword is a method from the User schema.
       if (!user || !user.correctPassword(req.body.password)) {
           throw HttpError(401);
       } else {
          	req.login(user, function () {
				res.json(user);
			});
       }
   	})
    .then(null, next);

	// User.findOne({req.body.email).exec()
	// .then(function (user) {
	// 	if (!user) throw HttpError(401);
	// 	req.login(user, function () {
	// 		res.json(user);
	// 	});
	// })
	// .then(null, next);
});

router.post('/signup', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;