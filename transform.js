var jsdom = require('jsdom'),
    jquery = require('jquery');

module.exports = function(data, func, callback) {
        var transform = func.bind(data);
        callback(transform(data));
};
