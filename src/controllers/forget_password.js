'use strict'

const conn = require('../configs/db');
const nodemailer = require('nodemailer');
const email = 'clone.carousell@gmail.com';
const mcache = require('memory-cache');
const crypto  	 = require('crypto');
const algorithm  = 'aes-256-ctr';
const password 	 = 'd6F3Efeq';

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

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
    let key = '__code__' + mailTo
    mcache.put(key, code, 10 * 1000);
    mcache.put('email', mailTo, 10 * 1000);
    const mailOptions = {
        from: email,
        to: mailTo,
        subject: 'CCarousell Reset Password',
        text: 'Use this code to reset password ' + code
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send({status: 403, message: error})
        }
        else {
            res.send({status: 200, info: info, message: 'Mail sent!'})
        }
    });
}

exports.resetPassword = function(req, res){
    let email = mcache.get('mail')
    let key = '__code__' + email
    let myCode = req.body.code
    let code = mcache.get(key)
    let newPass = req.body.newPass;

    if(myCode !== code){
        res.send({status: 403, message: 'Incorrect code'})
    }
    else{
        conn.query(`UPDATE user SET password=? WHERE email=?`, [crypto(newPass), email], function(error, rows){
            try {
                res.send({status: 200, message: 'Password changed successfully!'})            
            }
            catch (error) {
                res.send({status: 403, message: 'Change password failed'})
            }
        })
    }
}