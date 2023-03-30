import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config({path: '.env'})

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

let ResetPasswordEmail = async (name, email, host, token)=>{
    let template = `
        <div style="background-color: black; padding: 20px; border-radius: 10px; border: none;">
            <p style="color: white">Hello ${name}, here is the link to reset your account. Dont share it with anyone else</p>
            <a href="${process.env.NODE_ENV==='production' ? 'https' : 'http'}://${host}/reset/${token}">reset link</a>
        </div>
    `

    // send mail with defined transport object
    await transporter.sendMail({
        from: `"Chat App" <${process.env.SMTP_USERNAME}>`, // sender address
        to: email, // list of receivers
        subject: 'Reset Password | Chat App', // Subject line
        html: template  // html body
    });
}

export default ResetPasswordEmail;