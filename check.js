var hipchat = require('node-hipchat'),
	http = require('http'),
    mailer = require('./mailer.js'),
    config = require('./config.js');

var HC = new hipchat(config.notifications.hipchat.token),
	pages = config.pages;

console.log('starting vcheck');
check();
loop();

function loop() {
	setTimeout(function() {
		check();
		loop();
	}, config.interval * 1000);
}

function check() {
	pages.forEach(function(item) {
		http.get(item.url, function(res) {
			res.on('data', function (chunk) {
			  	data = ''+ chunk;
			  	if (res.statusCode === 200) {
				  	if (!item.data) {
				  		console.log(item.name + ' initial version  ' + data);
                        item.data = data;
                    }
				  	if (item.data !== data) {
				  		console.log(item.name + ' ' + data);
				  		item.data = data;
				  		postUpdate(item);
				  	}
			 	}
			});
		}).on('error', function(e) {
			console.log('error requesting ' + item.name + ': ' + e.message);
		});	
	});
}


function postUpdate(item) {
	HC.postMessage({
		room: item.room ? item.room : config.notifications.hipchat.room,
		from: item.name,
		message: '/code ' + item.data,
		message_format: 'text'
	}, function(data) {
        if (!data || data.status !== 'sent') {
        	console.log(data);
        }
	});
    if (item.email) {
       mailer.send(item.email, 'webapi ' + item.name + ' has been deployed', item.data);  
    }
}
