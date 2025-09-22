import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';

export const generateOTP = () => {
    return otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
};

export const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'car rent',
            to: email,
            subject: 'OTP for Account Deletion',
            html: `<p>Your OTP for account deletion is: <strong style="font-size: 20px;">${otp}</strong></p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP via email');
    }
}