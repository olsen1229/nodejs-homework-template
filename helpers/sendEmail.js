import nodemailer from "nodemailer";
import "dotenv/config";

const { GMAIL_EMAIL, GMAIL_PASSOWRD}  = process.env

const nodemailerConfig = {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465, // SSL (Secure Sockets Layer) ia a security protocol used to establish an enrypted link between a web server and a browser (or between any two systems, such as server-to-server communication).
    secure: true,
    auth: {
        user: GMAIL_EMAIL ,
        pass: GMAIL_PASSOWRD,
    }

};

// transporter object
const transport = nodemailer.createTransport(nodemailerConfig);

// transporter function
const sendEmail = async (data) => {
    // we will pass the data including the subject, recipient and content inside a unified object which corresponds to the email
    const email = { ...data, from: GMAIL_EMAIL };
    await transport.sendMail(email);
};

export { sendEmail };