var slack = require('node-slack'),
    slackify = require('slackify-html'),
    config = require('./config.js');

exports.send = function(from, text, options) {
    var proxy = {};
    if (config.proxy) {
        proxy.proxy = 'http://' + config.proxy.hostname + ':' + config.proxy.port;
    }
    var client = new slack(options.hook, proxy);
    client.send({ text: slackify(text), channel: options.room, username: from});
};
