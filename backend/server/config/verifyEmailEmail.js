import transporter from "./transporter.js";

const VerifyEmailEmail = async (email, otp)=>{
    const template = `
        <div style="background-color: black; padding: 20px; border-radius: 10px; border: none;">
            <div>
                <p style="color: white">Welcome to ChatApp, you need to verify your email with OTP to create the account. Dont share it with anyone else</p>
            </div>
            <div>
                <p style="color: white">OTP: ${otp}</p>
            </div>
        </div>
    `

    // send mail with defined transport object
    await transporter.sendMail({
        from: `"ChatApp" <${process.env.SMTP_USERNAME}>`, // sender address
        to: email, // list of receivers
        subject: 'Verify Email | ChatApp', // Subject line
        html: template  // html body
    });
}

export default VerifyEmailEmail;