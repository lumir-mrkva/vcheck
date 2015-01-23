var jsdom = require('jsdom'),
    jquery = require('jquery');

module.exports = function(data, func, callback) {
    jsdom.env(data, function (err, context) {
        if (err) console.log(err);
        var $ = jquery(context);
        callback(func($));
    });
};