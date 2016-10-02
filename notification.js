"use strict";

var helper = require("sendgrid").mail,
	// eslint-disable-next-line new-cap
	sg = require("sendgrid")(process.env.SENDGRID_API_KEY);

var notify = function(user) {
	var personalization = new helper.Personalization();
	personalization.addTo(new helper.Email(user.email, user.name));

	var mail = new helper.Mail();
	mail.setFrom(new helper.Email("notification@mtlbestapartments.com"));
	mail.addPersonalization(personalization);
	mail.addContent(new helper.Content("text/plain", "new apartment"));
	mail.addContent(new helper.Content("text/html", "new apartment"));
	mail.setTemplateId("8f230f32-c882-4d07-8a60-6fac8c96bc59");

	var request = sg.emptyRequest();
	request.method = "POST";
	request.path = "/v3/mail/send";
	request.body = mail.toJSON();

	// eslint-disable-next-line new-cap
	sg.API(request, function(error, response) {
		if (error) {
			console.log(error);
		}

		if (response.statusCode !== 202) {
			console.log(response.statusCode);
			console.log(response.body);
		}
	});
};

module.exports.notify = notify;
