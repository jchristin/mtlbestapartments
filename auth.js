"use strict";

var _ = require("lodash"),
	crypto = require("crypto"),
	passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	ObjectID = require("mongodb").ObjectID,
	database = require("./database");

passport.use(new LocalStrategy(function(username, password, done) {
	database.users.findOne({
		email: username
	}, function(err, doc) {
		if (err) {
			console.log(err);
			done(err);
		} else if (doc === null) {
			done(null, false);
		} else {
			var shasum = crypto.createHash("sha1");
			shasum.update(password);

			if (doc.password === shasum.digest("hex")) {
				done(null, doc);
			} else {
				done(null, false);
			}
		}
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	database.users.findOne({
		_id: new ObjectID(id)
	}, function(err, doc) {
		done(err, doc);
	});
});

module.exports.initialize = function() {
	return passport.initialize();
};

module.exports.session = function() {
	return passport.session();
};

module.exports.isAuthenticated = function(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect("/");
	}
};

module.exports.signUp = function(req, res, next) {
	database.users.findOne({
		email: req.body.username
	}, function(err, doc) {
		if (err) {
			next(err);
		} else if (doc === null) {
			// Create a new user in database.
			var shasum = crypto.createHash("sha1");
			shasum.update(req.body.password);

			database.users.insertOne({
				name: req.body.name,
				email: req.body.username,
				password: shasum.digest("hex"),
				date: new Date()
			}, function(err2) {
				if (err2) {
					next(err2);
				} else {
					passport.authenticate("local")(req, res, function() {
						res.sendStatus(200);
					});
				}
			});
		} else {
			res.status(409).send("Email already used.");
		}
	});
};

module.exports.signIn = function(req, res, next) {
	passport.authenticate("local", function(err, user) {
		if (err) {
			next(err);
			return;
		}

		if (!user) {
			res.sendStatus(400);
			return;
		}

		req.logIn(user, function(err2) {
			if (err2) {
				next(err2);
				return;
			}

			res.sendStatus(200);
		});
	})(req, res, next);
};

module.exports.signOut = function(req, res) {
	req.logout();
	res.redirect("/");
};

module.exports.getUserInfo = function(req, res) {
	if (req.user === undefined) {
		res.json(null);
	} else {
		res.json(_.pick(req.user, "_id", "name", "email"));
	}
};

module.exports.deleteUser = function(req, res, next) {
	database.users.deleteOne({
		_id: req.user._id
	}, function(err) {
		if (err) {
			next(err);
		} else {
			req.logout();
			res.end();
		}
	});
};

module.exports.updateLayout = function(req, res, next) {
	database.users.updateOne({
		_id: req.user._id
	}, {
		$set: {
			layout: req.body.layout
		}
	}, function(err) {
		if (err) {
			next(err);
		} else {
			res.end();
		}
	});
};

module.exports.getLayout = function(req, res, next) {
	database.users.findOne({
		_id: req.user._id
	}, function(err, doc) {
		if (err) {
			next(err);
		} else if (doc === null) {
			res.sendStatus(404);
		} else {
			res.json(doc.layout);
		}
	});
};
