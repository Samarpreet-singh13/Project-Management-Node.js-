// creating a mail template to send mails 
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// for sending email i have used mailtrap service
export const sendEmail=async(options)=>{
    const mailGenerator=new Mailgen({
        theme:'default',
        product:{
            name:"Project Management App",
            link:'https://projectmanagementapp.com/'
        }
    });

    const emailTextual=mailGenerator.generatePlaintext(options.mailGenContent);
    const emailHTML=mailGenerator.generate(options.mailGenContent);

    const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }
    });

    const mail={
        from:"mail@projectmanagementapp.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHTML
    }

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

const emailVerificationMailGenContent= (userName,verificationURL)=>{
    return {
        body:{
            name:userName,
            intro:"Welcome to our Project Management App! We're excited to have you on board.",
            action:{
                instruction:"To verify your email address, please click the button below:",
                button:{
                    color:"#22BC66",
                    text:"Verify your email",
                    link:verificationURL
                },
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to assist you."
        },
    };
};

const forgetPasswordMailGenContent= (userName,passwordResetURL)=>{
    return {
        body:{
            name:userName,
            intro:"You have requested to reset your password. Click the button below to proceed.",
            action:{
                instruction:"To reset your password, please click the button below:",
                button:{
                    color:"#22BC66",
                    text:"Reset your password",
                    link:passwordResetURL
                },
            },
            outro:"If you did not request a password reset, please ignore this email or reply to let us know."
        },
    };
};

export {
    emailVerificationMailGenContent,
    forgetPasswordMailGenContent
}