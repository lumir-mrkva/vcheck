var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lumir.mrkva@topmonks.com',
        pass: 'xxx' 
    }
});

exports.send = function(to, subject, body) {
    var options = {
        from: 'vcheck <lumir.mrkva@topmonks.com>',
        to: to,
        subject: subject,
        text: body
    };
    transporter.sendMail(options, function(error, info) {
        if(error) {
            console.log('sending email failed', error);
        }
    });
};

