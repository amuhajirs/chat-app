import transporter from "./transporter.js";

const ResetPasswordEmail = async (name, email, host, token)=>{
    const template = `
        <div style="background-color: black; padding: 20px; border-radius: 10px; border: none;">
            <p style="color: white">Hello ${name}, here is the link to reset your password account. Dont share it with anyone else</p>
            <a href="${process.env.NODE_ENV==='production' ? 'https' : 'http'}://${host}/reset/${token}">reset link</a>
        </div>
    `

    // send mail with defined transport object
    await transporter.sendMail({
        from: `"ChatApp" <${process.env.SMTP_USERNAME}>`, // sender address
        to: email, // list of receivers
        subject: 'Reset Password | ChatApp', // Subject line
        html: template  // html body
    });
}

export default ResetPasswordEmail;