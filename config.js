var config = {
	interval: 15,
	/*
	proxy: {
		host: 'localhost',
		port: 8888
	},
	*/
	pages: [
        {
            name: 'steam',
            url: 'http://store.steampowered.com',
            room: 'Playground',
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
		    service: 'Gmail',
		    auth: {
		        user: 'lumir.mrkva@topmonks.com',
		        pass: process.env.EMAIL_PASS
		    }
		}
	}
};

module.exports = config;