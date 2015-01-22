var jsdom = require('jsdom'),
	jquery = require('jquery');

jsdom.env('http://pred-cic-wbl.vs.csin.cz/diagnostic/about', function (err, context) {
	if (err) console.log(err);

	var $ = jquery(context);
	console.log(transform($));
});

var transform = function($) {
	return $('.panel-body').first().text().trim().replace(/\n\ */gi,',');
}
