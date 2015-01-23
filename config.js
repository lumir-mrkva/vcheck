var wblTransform = function($) {
    return $('.panel-body').first().text().trim().replace(/\n\ */gi,', ');
};

var config = {
	interval: 15,
	/*proxy: {
		host: 'localhost',
		port: 5860
	},*/
	pages: [
        {
            name: 'wbl preprod',
            url: 'http://pred-cic-wbl.vs.csin.cz/diagnostic/about',
            transform: wblTransform
        },{
            name: 'wbl st2',
            url: 'http://st2-cic-wbl.vs.csin.cz:48400/diagnostic/about',
            transform: wblTransform
        },{
            name: 'wbl st1',
            url: 'http://st1-cic-wbl.vs.csin.cz:48300/diagnostic/about',
            transform: wblTransform
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
