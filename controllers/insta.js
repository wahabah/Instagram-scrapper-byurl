var express = require('express');
var fs = require('fs');
var request = require('sync-request');
// var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var router = express.Router();

router.post('/byurl', async function (req, res) {
	var ResponseCode = 200;
	var ResponseMessage = ``;
	var ResponseData = null;
	try {
		if(req.body.url) {
			var url = req.body.url;
			var pageres = request('GET', url, {
			  headers: {
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
				'cache-control': 'max-age=0',
				'upgrade-insecure-requests': '1',
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
			  },
			});
			var $ = cheerio.load(pageres.getBody('utf8'));

			/* Get the proper script of the html page which contains the json */
			let script = $('script').eq(4).html();

			/* Traverse through the JSON of instagram response */
			let { entry_data: { ProfilePage : {[0] : { graphql : {user} }} } } = JSON.parse(/window\._sharedData = (.+);/g.exec(script)[1]);

			ResponseData = user;

			console.log(ResponseData)

			ResponseMessage = "Success";
			ResponseCode = 200;


		} else {
			ResponseMessage = "URL is empty";
			ResponseCode = 204
		}
	} catch (error) {
		ResponseMessage = `${error}`;
		ResponseCode = 400
	} finally {
		return res.status(200).json({
			code : ResponseCode,
			data : ResponseData,
			msg : ResponseMessage
		});
	}
});


module.exports = router;
