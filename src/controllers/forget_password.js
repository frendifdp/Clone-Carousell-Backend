'use strict'
require('dotenv/config');

const conn = require('../configs/db');
const nodemailer = require('nodemailer');
const email = process.env.EMAIL
const emailPassword = process.env.EMAIL_PASSWORD


const mcache = require('memory-cache');
const crypto  	 = require('crypto');
const algorithm  = process.env.ENC_ALGORITHM;
const password 	 = process.env.ENC_PASS;

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
      pass: emailPassword
    }
});

exports.sendEmail = function(req, res){
    let mailTo = req.body.email;
    let code = Math.floor(Math.random() * Math.floor(999999))
    if(code < 100000){
        code = code + 100000
    }
    let key = '__code__'+mailTo
    mcache.put(key, code, 300000);
    mcache.put('mail', mailTo, 300000);
    const mailOptions = {
        from: email,
        to: mailTo,
        subject: 'CCarousell Reset Password',
        text: 'Use this code to reset password ' + code + ' this code will expired after 5 minutes'
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
    let email = mcache.get('mail');
    let myEmail = email;
    let key = '__code__'+myEmail;
    let myCode = Number(req.body.code);
    let code = mcache.get(key);
    let newPass = req.body.newPass.toString() || "admin";
    console.log(code)
    if(myCode !== code){
        res.send({status: 403, message: 'Incorrect code'})
    }
    else{
        conn.query(`UPDATE user SET \`password\`='${encrypt(newPass)}' WHERE email='${email}'`, function(error, rows){
            try {
                res.send({status: 200, message: 'Password changed successfully!'})            
            }
            catch (error) {
                res.send({status: 403, message: 'Not registered email'})
            }
        })
    }
}