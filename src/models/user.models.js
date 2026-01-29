// writing or creating the schema/structure of the database 
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

// this is a method added in the model/schema for password comparison
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

// Access and refresh tokens are the tokens with data embedded in them.
// method to generate access token
userSchema.methods.generateAccesstoken= function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// method to generate refresh token
userSchema.methods.generateRefreshtoken= function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateTemporaryToken= function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const HashedToken=crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")

    const tokenExpiry=Date.now()+20*60*1000; // 20 minutes

    return {HashedToken, unHashedToken, tokenExpiry};
}


export const User = mongoose.model("User", userSchema);