/* global before, describe, it */

"use strict";

var request = require("supertest"),
	database = require("../database"),
	server = null;

// Can only run if all env variables are defined.
describe.skip("database", function() {
	before(function(done) {
		database.connect().then(function() {
			server = require("../server");
			done();
		});
	});

	describe("POST /api/apart", function() {
		it("should reject apart outside Montreal", function(done) {
			request(server)
				.post("/api/apart")
				.send({address: "211 Boulevard Churchill, Greenfield Park, QC J4V 2M5"})
				.expect(400, done);
		});
	});

	describe("GET /api/latest", function() {
		it("should respond with 200", function(done) {
			request(server)
				.get("/api/latest")
				.expect(200, done);
		});
	});
});
