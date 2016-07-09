"use strict";

var helper = require("sendgrid").mail,
	sg = require("sendgrid").SendGrid(process.env.SENDGRID_API_KEY);

function notify(user, apartment) {
	if(!user.notification) {
		return;
	}

	var personalization = new helper.Personalization();
	personalization.addTo(new helper.Email(user.email, user.name));

	var mail = new helper.Mail();
	mail.setFrom(new helper.Email("notification@fleub.com"));
	mail.addPersonalization(personalization);
	mail.addContent(new helper.Content("text/plain", "new apartment"));
	mail.addContent(new helper.Content("text/html", "new apartment"));
	mail.setTemplateId("8f230f32-c882-4d07-8a60-6fac8c96bc59");

	var request = sg.emptyRequest();
	request.method = "POST";
	request.path = "/v3/mail/send";
	request.body = mail.toJSON();

	sg.API(request, function(response) {
		if(response.statusCode != 202) {
			console.log(response.statusCode);
			console.log(response.body);
		}
	});
}

module.exports.notify = notify;
