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

app.post('/api/email', (req, res) => { 

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

	console.log(JSON.stringify(req.body));

	if(req.body) {
		res.end(req.body);
	}
	else {
		res.end("REQ BODY NOT FOUND")
	}

});


module.exports = app;