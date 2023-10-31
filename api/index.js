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

app.get('/api/email/:from/:to/:subject/:body/:attachmentContent/:attachmentName/:attachmentType', (req, res) => {  
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { from, to, subject, body, attachmentContent, attachmentName, attachmentType } = req.params;

	// Send an email:
	var client = new postmark.ServerClient("3dbab09c-f2a1-44e5-8fa2-14c3a9a66b33");

	try {
		client.sendEmail({
			"From": from,
			"To": to,
			"Subject": subject,
			"HtmlBody": body,
			"TextBody": "Hello from Postmark!",
			"MessageStream": "outbound",
			"Attachments": [
				{
					"Name": attachmentName,
					"Content": attachmentContent,
					"ContentType": "application/octet-stream"
				}
			]
	});
	} catch (error) {
		res.end(error);
	}

  res.end("Test");
});


module.exports = app;