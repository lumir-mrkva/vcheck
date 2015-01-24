var hipchat = require('node-hipchat'),
    http = require('http'),
    mailer = require('./mailer.js'),
    config = require('./config.js'),
    transform = require('./transform.js');

var HC = new hipchat({
        apikey: config.notifications.hipchat.token,
        proxy: config.proxy
    }),
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
        var options;
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
            options = item.url;
        }
        http.get(options, function(res) {
            var data = '';
            res.on('data', function (chunk) {
                data = data + chunk;
            });
            res.on('end', function () {
                var compare = function(data) {
                    if (!item.data) {
                        console.log(item.name + ' initial version  ' + data);
                        item.data = data;
                        if (process.argv[2] === 'test') postUpdate(item);
                    }
                    if (item.data !== data) {
                        console.log(item.name + ' ' + data);
                        item.data = data;
                        postUpdate(item);
                    }
                };
                if (res.statusCode === 200) {
                    if (item.transform) {
                        transform(data, item.transform, compare);
                    } else {
                        compare(data);
                    }
                }
            });
        }).on('error', function(e) {
            console.log('error requesting ' + item.name + ': ' + e.message);
        }); 
    });
}

function postUpdate(item) {
    var room = item.room ? item.room : config.notifications.hipchat.room;
    HC.postMessage({
        room: room,
        from: item.name,
        message: '/code ' + item.data,
        message_format: 'text'
    }, function(res, data) {
        if (!res || res.status !== 'sent') {
            console.log('notification to hipchat room ' + room + ' failed: ' + data);
        }
    });
    if (item.email) {
       mailer.send(item.email, 'webapi ' + item.name + ' has been deployed', item.data);  
    }
}