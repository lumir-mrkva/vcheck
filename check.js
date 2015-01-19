var hipchat = require('node-hipchat'),
	http = require('http'),
    mailer = require('./mailer.js')

var HC = new hipchat('xxx');

var emailSubs = '';

var interval = 15; //sec

var pages = [
	{
		name: 'production',
		url: 'http://www.csas.cz/webapi/api/v1/version',
        email: emailSubs
	}
];

console.log('starting vcheck');
loop();

function loop() {
	setTimeout(function() {
		pages.forEach(function(item) {
			http.get(item.url, function(res) {
			  res.on('data', function (chunk) {
			  	data = ''+chunk;
			  	if (res.statusCode === 200) {
				  	if (!item.data) {
				  		console.log(item.name + ' initial version  ' +data);
                        item.data = data;
                    }
				  	if (item.data !== data) {
				  		console.log(item.name + ' ' +data);
				  		item.data = data;
				  		postUpdate(item);
				  	}
			  	}
			  });
			}).on('error', function(e) {
			  console.log('error requesting ' + item.name + ': ' + e.message);
			});	
		});
		loop();
	}, interval * 1000);
}


function postUpdate(item) {
	HC.postMessage({
		room: 'WebApi',
		from: item.name,
		message: '/code ' + item.data,
		message_format: 'text'
	}, function(data) {
        if (!data || data.status !== 'sent') console.log(data);
	});
    if (item.email) {
       mailer.send(item.email, 'webapi ' + item.name + ' has been deployed', item.data);  
    }
}
