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
            transform: function($) {
                return $('#footer_text div').first().text();
            }
        }
    ],
    notifications: {
        hipchat: {
            token: process.env.HIPCHAT_TOKEN,
            room: 'WebApi'
        },
        email: {
            from: 'vcheck <lumir.mrkva@topmonks.com>',
            subject: function(page) {
                return 'new version of ' + page.name + ' has been deployed';
            },
            service: 'Gmail',
            auth: {
                user: 'lumir.mrkva@topmonks.com',
                pass: process.env.EMAIL_PASS
            }
        }
    }
};

module.exports = config;
