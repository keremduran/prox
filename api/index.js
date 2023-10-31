const app = require('express')();
const { v4 } = require('uuid');
var postmark = require("postmark");
let nodemailer = require('nodemailer');

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(`Item: ${slug}`);
});

app.post('/api/email', (req, res) => { 
	console.log("TEST");

	const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: 'unsecuretestprojects@gmail.com',
      pass: "wjrc pwyx fkxh bvvk",
    },
    secure: true,
  });

	const mailData = {
    from: 'unsecuretestprojects@gmail.com',
    to: 'keremduran.fw@gmail.com',
    subject: `Message From`,
    html: `<div>Test</div><p>Sent from:test</p>`,
  };

	try {

		console.log("MAIL SENDING!");

		transporter.sendMail(mailData, function (error, info) {
			if (error) {
				throw new Error(error);
			} else {
				console.log("Email Sent", info);
				return true;
			}
		});
	} catch (error) {
		console.log(error)
	}




	// const mailData = {
  //   from: 'inspiredigital.test@gmail.com',
  //   to: 'keremduran.fw@gmail.com',
  //   subject: `Message From ${req.body.name}`,
  //   html: `<div>${req.body.emailContent}</div><p>Sent from:
  //   ${req.body.email}</p>`,
  // };

	// // Send an email:
	// var client = new postmark.ServerClient("3dbab09c-f2a1-44e5-8fa2-14c3a9a66b33");

	// try {
	// 	client.sendEmail({
	// 		"From": "kerem@weareoutpost.ca",
	// 		"To": "keremduran.fw@gmail.com",
	// 		"Subject": "Hello from Postmark",
	// 		"HtmlBody": "<strong>Hello</strong> dear Postmark user.",
	// 		"TextBody": "Hello from Postmark!",
	// 		"MessageStream": "outbound"
	// });
	// } catch (error) {
	// 	res.end(error);
	// }

	console.log(JSON.stringify(req));
	res.end("Test")
});


module.exports = app;