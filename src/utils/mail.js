// creating a mail template to send mails 
import Mailgen  from "mailgen";

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