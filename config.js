var config = {
    interval: 15,
    proxy: {
        host: 'localhost',
        port: 8888
    },
    pages: [
        {
            name: 'steam',
            url: 'http://store.steampowered.com',
            room: 'Playground',
            email: 'lumir.mrkva@topmonks.com',
            subject: function() {
                return this.name + ' footer has changed';
            },
            transform: function($) {
                return $('#footer_text div').first().text();
            }
        },{
            name: 'webapi',
            url: 'http://www.csast.csas.cz/webapi/api/v1/version',
            email: 'lumir.mrkva@topmonks.com',
            print: function() {
                var v = JSON.parse(this.data);
                return '<b>' + v.version + '</b> &bull; revision '
                    + v.revision.substr(0,5).link('https://github.com/topmonks/web-api-concept/tree/' + v.revision)
                    + ' &bull; build ' + v.date.substr(0, v.date.lastIndexOf(':')) + ' &bull; wbl ' + v.wbl
                    + ' &bull; ' + 'details &raquo;'.link(this.url) + '';
            }
        }
    ],
    notifications: {
        hipchat: {
            token: process.env.HIPCHAT_TOKEN,
            room: 'Playground'
        },
        email: {
            from: 'vcheck <lumir.mrkva@topmonks.com>',
            subject: function() {
                return 'new version of ' + this.name + ' has been deployed';
            },
            service: 'Gmail',
            auth: {
                user: 'lumir.mrkva@topmonks.com',
                pass: process.env.HIPCHAT_TOKEN
            }
        }
    }
};

module.exports = config;
