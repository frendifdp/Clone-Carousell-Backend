'use strict'

const conn = require('../configs/db');
const nodemailer = require('nodemailer');
const email = 'clone.carousell@gmail.com';
// const password;
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: 'gmail',
    auth: {
      user: email,
      pass: 'campjogja'
    }
});

exports.sendEmail = function(req, res){
    let mailTo = req.body.email;
    const mailOptions = {
        from: email,
        to: mailTo,
        subject: 'Sending Email using Node.js',
        text: 'yuhu! :v'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send({status: 403, message: error})
        } else {
            res.send({status: 200, info: info, message: 'Mail sent!'})
        }
    });
}