var jsdom = require('jsdom'),
	jquery = require('jquery');

jsdom.env('http://store.steampowered.com/', function (err, context) {
	if (err) console.log(err);

	var $ = jquery(context);
	console.log($('#footer_text div').first().text());
})