"use strict";

var _ = require("lodash"),
	crypto = require("crypto"),
	passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	ObjectID = require("mongodb").ObjectID,
	database = require("./database");

passport.use(new LocalStrategy(function(email, password, done) {
	database.users.findOne({
		email: email
	}, function(err, doc) {
		if (err) {
			console.log(err);
			done(err);
		} else {
			if (doc === null) {
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

module.exports.signUp = function(req, res) {
	database.users.findOne({
		email: req.body.email
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
		} else {
			// Checks if email is already used.
			if (doc !== null) {
				res.status(409).send("Email already used.");
			} else {
				// Create a new user in database().
				var shasum = crypto.createHash("sha1");
				shasum.update(req.body.password);

				database.users.insertOne({
					name: req.body.name,
					email: req.body.username,
					password: shasum.digest("hex"),
					date: new Date()
				}, function(err) {
					if (err) {
						console.log(err);
						res.status(500).send("Server error. Please retry later.");
					} else {
						passport.authenticate("local")(req, res, function() {
							res.sendStatus(200);
						});
					}
				});
			}
		}
	});
};

module.exports.signIn = function(req, res, next) {
	passport.authenticate("local", function(err, user, info) {
		if (err) {
			return next(err);
		}

		if (!user) {
			return res.sendStatus(400);
		}

		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}

			return res.sendStatus(200);
		});
	})(req, res, next);
};

module.exports.signOut = function(req, res) {
	req.logout();
	res.redirect("/");
};

module.exports.getUserInfo = function(req, res) {
	if (req.user !== undefined) {
		res.json(_.pick(req.user, "_id", "name", "email"));
	} else {
		res.json(null);
	}
};

module.exports.deleteUser = function(req, res) {
	database.users.deleteOne({
		_id: req.user._id
	}, function(err) {
		if (err) {
			console.log(err);
			res.status(500).end();
		} else {
			req.logout();
			res.end();
		}
	});
};

module.exports.updateLayout = function(req, res) {
	database.users.updateOne({
		_id: req.user._id
	}, {
		$set: {
			layout: req.body.layout
		}
	}, function(err) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
		} else {
			res.end();
		}
	});
};

module.exports.getLayout = function(req, res) {
	database.users.findOne({
		_id: req.user._id
	}, function(err, doc) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
		} else {
			if (doc === null) {
				res.sendStatus(404);
			} else {
				res.json(doc.layout);
			}
		}
	});
};
