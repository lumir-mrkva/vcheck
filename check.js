var hipchat = require('node-hipchat'),
    url = require('url'),
    http = require('http'),
    https = require('https'),
    moment = require('moment');

var mailer = require('./mailer.js'),
    slacker = require('./slacker.js'),
    config = require('./config.js'),
    transform = require('./transform.js');

var pages = config.pages;

console.log('starting vcheck');
check();
setInterval(check, config.interval * 1000);

function check() {
    pages.forEach(function(item) {
        var options, protocol;
        if (config.proxy) {
            options = {
                host: config.proxy.host,
                port: config.proxy.port,
                path: item.url,
                headers: {
                    Host: item.url
                }
            }
        } else {
            options = url.parse(item.url);
        }
        if (item.headers) {
            options.headers = item.headers;
        }
        if (!item.url) {
            console.error('missing url in ' + item.name);
            return;
        }
        protocol = item.url.indexOf('https:') === 0 ? https : http;
        protocol.get(options, function(res) {
            var data = '';
            res.on('data', function (chunk) {
                data = data + chunk;
            });
            res.on('end', function () {
                var compare = function(data) {
                    if (!item.data && data != null && data !== 'null') {
                        console.log(item.name + ' initial version: ' + data.eclipse(500));
                        item.previous = null;
                        item.data = data;
                        item.changed = moment();
                        if (process.argv[2] === 'test') postUpdate(item);
                    }
                    if (data !== null && data !== 'null' && item.data !== data
                      && !(item.previous === data && moment().subtract(30, 'm').isBefore(item.changed))) {
                        console.log(item.name + ': ' + data.eclipse(500));
                        item.previous = item.data;
                        item.data = data;
                        item.changed = moment();
                        postUpdate(item);
                    }
                };

                if (res.statusCode === 200) {
                    if (item.transform) {
                        transform(data, item.transform, compare);
                    } else {
                        compare(data);
                    }
                } else {
                    console.error('error requesting ' + item.name, data);
                }
            });
        }).on('error', function(e) {
            console.error('error requesting ' + item.name + ': ' + e.message);
        });
    });
}

function hipchatClient(token) {
    return new hipchat({
        apikey: token,
        proxy: config.proxy
    });
}

function postUpdate(item) {
    var conf = config.notifications || {},
        email = conf.email,
        message = item.print ? item.print() : conf.print ? conf.print.bind(item)() : item.data,
        rooms = [].concat(item.room ? item.room : conf.hipchat ? conf.hipchat.room : []);
        slacks = [].concat(item.slack);

    rooms.forEach(function(room) {
        var token = config.notifications.hipchat.token;
        if (room instanceof Object && room.token) {
            token = room.token;
            room = room.id;
        }
	    hipchatClient(token).postMessage({
	        room: room,
	        from: item.name,
	        message: message,
	        message_format: 'html'
	    }, function(res, data) {
	        if (!res || res.status !== 'sent') {
	            console.log('notification to hipchat room ' + room + ' failed: ' + data);
	        }
	    });
    });
    slacks.forEach(function(options) {
        if (options) slacker.send(item.name, message, options);
    });

    if (item.email && email) {
        var subject = item.subject ? item.subject(item) : email.subject ? email.subject.bind(item)() : item.name
        mailer.send(item.email, subject, message);
    }
}

String.prototype.eclipse = function(length) {
    if (this.length > length)
        return this.substr(0, length) + '...';
    return this.toString();
}
