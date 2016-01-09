"use strict";

var crypto = require("crypto"),
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
		_id: req.body.email
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

module.exports.getUserId = function(req, res) {
	if (req.user !== undefined) {
		res.send(req.user._id);
	} else {
		res.end();
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
