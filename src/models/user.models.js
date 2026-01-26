// writing or creating the schema/structure of the database 
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
        avatar: {
            type: {
                url: String,
                localPath: String,
            },
            default: {
                url: `https://placeholder.co/200X200`,
                localPath: ""
            }
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        forgotPasswordToken: {
            type: String
        },
        forgotPasswordExpiry: {
            type: Date
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpiry: {
            type: Date
        }
    },{
        timestamps: true
    }
);
// The next parameter tells Mongoose to proceed to the next middleware or complete the save operation.
// we used normal function instead of arrow function to use 'this' keyword
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
});

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

export const User = mongoose.model("User", userSchema);