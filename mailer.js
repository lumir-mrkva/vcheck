var nodemailer = require('nodemailer'),
    config = require('./config.js')

exports.send = function(to, subject, body) {
    var email = config.notifications.email;
    if (!email) {
        console.log('can not send email - notifications email not configured');
        return;
    }
    var options = {
        from: email.from,
        to: to,
        subject: subject,
        text: body
    },
    transporter = nodemailer.createTransport(email);
    transporter.sendMail(options, function(error, info) {
        if(error) {
            console.log('sending email failed', error);
        }
    });
};

