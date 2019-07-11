'use strict'

const conn = require('../configs/db');
const nodemailer = require('nodemailer');
const email = 'clone.carousell@gmail.com';
const mcache = require('memory-cache');
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
    let code = Math.floor(Math.random() * Math.floor(999999))
    if(code < 100000){
        code = code + 100000
    }
    let key = '__code__'
    mcache.put(key, code, 10 * 1000);
    // const mailOptions = {
    //     from: email,
    //     to: mailTo,
    //     subject: 'CCarousell Reset Password',
    //     text: 'Use this code to reset password ' + code
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         res.send({status: 403, message: error})
    //     }
    //     else {
    //         res.send({status: 200, info: info, message: 'Mail sent!'})
    //     }
    // });
}

exports.resetPassword = function(req, res){
    let id = req.params.id;
    let a = mcache.get('__code__')

    console.log(a)
}