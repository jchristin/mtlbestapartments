"use strict";

var _ = require("lodash"),
	crypto = require("crypto"),
	passport = require("passport"),
	LocalStrategy = require("passport-local").Strategy,
	ObjectID = require("mongodb").ObjectID,
	database = require("./database");

passport.use(new LocalStrategy(function(email, password, done) {
	database().collection("users").find({
		email: email
	}).toArray(function(err, docs) {
		if (err) {
			console.log(err);
			done(err);
		} else {
			if (_.size(docs) === 0) {
				done(null, false);
			} else {
				var shasum = crypto.createHash("sha1");
				shasum.update(password);

				if (docs[0].password === shasum.digest("hex")) {
					done(null, docs[0]);
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
	database().collection("users").find({
		_id: new ObjectID(id)
	}).toArray(function(err, docs) {
		if (err) {
			console.log(err);
			done(err);
		} else {
			if (_.size(docs) === 0) {
				done(null, false);
			} else {
				done(null, docs[0]);
			}
		}
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
	database().collection("users").find({
		_id: req.body.email
	}).toArray(function(err, docs) {
		if (err) {
			console.log(err);
			res.status(500).send("Server error. Please retry later.");
		} else {
			// Checks if email is already used.
			if (_.size(docs) > 0) {
				res.status(409).send("Email already used.");
			} else {
				// Create a new user in database().
				var shasum = crypto.createHash("sha1");
				shasum.update(req.body.password);

				database().collection("users").insertOne({
					name: req.body.name,
					email: req.body.email,
					password: shasum.digest("hex")
				}, function(err) {
					if (err) {
						console.log(err);
						res.status(500).send("Server error. Please retry later.");
					} else {
						res.send("Ok");
					}
				});
			}
		}
	});
};

module.exports.signIn = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/signin"
});

module.exports.signOut = function(req, res) {
	req.logout();
	res.redirect("/");
};

module.exports.getUser = function(req, res) {
	if (req.user !== undefined) {
		res.send(req.user._id);
	} else {
		res.end();
	}
};

module.exports.deleteUser = function(req, res) {
	database().collection("users").deleteOne({
		_id: new ObjectID(req.user._id)
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
