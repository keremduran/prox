const app = require('express')();
const { v4 } = require('uuid');
var postmark = require("postmark");
let nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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
	// Send an email:
	var client = new postmark.ServerClient("3dbab09c-f2a1-44e5-8fa2-14c3a9a66b33");

	try {
		client.sendEmail(req.body);
	} catch (error) {
		res.end(error);
	}

  console.log(req.body);

  // send back a response with the same data
  res.json(req.body);
});


module.exports = app;