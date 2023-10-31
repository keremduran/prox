const app = require('express')();
const { v4 } = require('uuid');
var postmark = require("postmark");

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

app.get('/api/email', (req, res) => {  
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');

	// Send an email:
	var client = new postmark.ServerClient("3dbab09c-f2a1-44e5-8fa2-14c3a9a66b33");

	client.sendEmail({
			"From": "kerem@weareoutpost.ca",
			"To": "kerem@weareoutpost.ca",
			"Subject": "Hello from Postmark",
			"HtmlBody": "<strong>Hello</strong> dear Postmark user.",
			"TextBody": "Hello from Postmark!",
			"MessageStream": "outbound"
	});

  res.end("Test");
});


module.exports = app;