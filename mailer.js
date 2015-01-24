var nodemailer = require('nodemailer'),
    config = require('./config.js')

exports.send = function(to, subject, body) {
    if (!config.notifications.email) {
        console.log('can not send email - notifications email not configured');
        return;
    }
    var options = {
        from: 'vcheck',
        to: to,
        subject: subject,
        text: body
    },
    transporter = nodemailer.createTransport(config.notifications.email);
    transporter.sendMail(options, function(error, info) {
        if(error) {
            console.log('sending email failed', error);
        }
    });
};

